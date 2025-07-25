import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import crypto from 'crypto';

import User from '../models/userModel.js';
import catchAsyncError from '../utils/catchAsyncError.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';

const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signUp = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  /** creating a jwt token and sending back to the user */
  const token = createToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser,
    },
  });
});

export const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  /**
   * 1. Check if email && password is enterd.
   *
   * 2. Check if user exists && password is correct.
   *
   * 3. If everything is fine, send json webtoken to client
   */

  /** 1. Check if email && password is enterd */

  if (!email || !password) {
    return next(new AppError('Please provide a valid email and password', 400));
  }

  /** 2. Check if user exists && password is correct */
  /**
   * select('+password') => to have the password back in our query, as the password is not given back in
   * document query as we have "select": false in the user schema.
   *
   * we explicitly selected the password field
   */

  const user = await User.findOne({ email: email }).select('+password');

  /** comparing the password */
  let isValidUser = false;
  if (user) {
    isValidUser = await user.correctPassword(password, user.password);
  }

  if (!isValidUser) {
    return next(new AppError('Incorrect email or password', 401));
  }

  /** 3. If everything is fine, send json webtoken to client */

  const token = createToken(user._id);

  res.status(201).json({
    status: 'success',
    token: token,
  });
});

/**
 * Middleware function for protecting routes
 *
 * Allowing only logged in user to access this routes
 */

export const protectedRoutes = catchAsyncError(async (req, res, next) => {
  /**
   * 1. Get the token and check if it exists
   *
   * 2. Validate the token
   *
   * 3. Check if user still exists
   *
   * 4. Check if user changed password after the jwt token was issued
   */

  /** 1. Get the token and check if it exists */
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')?.[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  /** 2. Validating the token */

  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  /**
   *  3. Check if user still exists
   *  Checking if the id we get in the response of verifing the token exists or not
   */
  const user = await User.findById(decodedData.id);

  if (!user) {
    return next(new AppError('The token is not valid', 401));
  }

  /** 4. Check if user has changed the password */
  if (user.changedPassword(decodedData.iat)) {
    return next(new AppError('Authorization failed. Please login again.', 401));
  }

  // ### This req.user is passed to the next middlware ###
  req.user = user;

  /** Now can access the protected routes */
  next();
});

/**
 *
 * Authentication : validating a user.
 *
 * Authorization : verifing if a user has permission to perform certain tasks, or to interact with certain
 * resources.
 */

export const accessRestrictedTo = (...roles) => {
  return (req, res, next) => {
    // ### roles in an array ex: ['admin', 'lead']

    if (!roles.includes(req.user.role)) {
      // 403 -> forbidden
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * Forgot password
 */

export const forgotPassword = async (req, res, next) => {
  /** 1. Get user based on entered email */
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found', 404));
  }

  /** 2. Generate random token */
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  /** 3. Send back the token to email */
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Please update your password using this link: ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset',
      message: message,
    });

    console.log(message, 'sendEmail====message');

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Something went wrong. Please try again later', 500)
    );
  }
};

/**
 * Reset password
 */

export const resetPassword = catchAsyncError(async (req, res, next) => {
  /** 1. Get user based on the token */

  /** get the hased token */
  const hasedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hasedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  /** 2. Set the new password, id token is not expired and there is a user */

  if (!user) {
    return next(new AppError('Token is invalid', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  /** assigned "undefined" as now we don't need these fields as they are no longer needed */
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = createToken(user._id);

  res.status(201).json({
    status: 'success',
    token: token,
  });

  /** 3. Update the changedPasswordAt property for the user  */
  /** In pre save middleware */

  /** 4. Log user in */
});

/** Updating user password */

export const updatePassword = catchAsyncError(async (req, res, next) => {
  /** 1. Get user */
  const user = await User.findById(req.user._id).select('+password');

  /** 2. check if old password is correct */
  let isValidUser = await user.correctPassword(
    req.body.currentPassword,
    user.password
  );
  if (!isValidUser) {
    return next(
      new AppError('wrong password, please enter correct password', 401)
    );
  }

  /** 3. If password is old correct, update the new entered password  */

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  /** 4. Log user in */
  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    token: token,
  });
});
