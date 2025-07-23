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
  resetPassword,
  signIn,
  signUp,
} from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(signUp);

router.route('/signin').post(signIn);

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-password').post(resetPassword);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
