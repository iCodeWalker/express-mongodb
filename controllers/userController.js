/**
 * Route handlers of Users
 */

import User from '../models/userModel.js';
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
