import express from 'express';

import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import {
  forgotPassword,
  protectedRoutes,
  resetPassword,
  signIn,
  signUp,
  updatePassword,
} from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(signUp);

router.route('/signin').post(signIn);

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-password/:token').patch(resetPassword);

router.route('/update-password').patch(protectedRoutes, updatePassword);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
