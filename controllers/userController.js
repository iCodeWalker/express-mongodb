/**
 * Route handlers of Users
 */

import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsyncError from '../utils/catchAsyncError.js';

export const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
});
export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not in use',
  });
};
export const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not in use',
  });
};
export const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not in use',
  });
};
export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not in use',
  });
};

const filterObject = (obj, allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((item) => {
    if (allowedFields.includes(item)) {
      newObj[item] = obj[item];
    }
  });

  return newObj;
};

export const updateUserData = catchAsyncError(async (req, res, next) => {
  /** 1. create error if user post password data */
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('Invalid route. Please use other route', 400));
  }

  /** 2. Filtered out unwanted fields from thr req.body that we never want to gets updated by the user */
  const filteredBody = filterObject(req.body, ['name', 'email']);

  /** 3. Update user document */
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  /** 4. Sending back the updated user data */
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteCurrentUser = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
