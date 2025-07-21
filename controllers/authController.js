import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import catchAsyncError from '../utils/catchAsyncError.js';
import AppError from '../utils/appError.js';

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
