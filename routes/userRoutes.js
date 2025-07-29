import express from 'express';

import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateUserData,
  deleteCurrentUser,
  getCurrentUserData,
} from '../controllers/userController.js';
import {
  accessRestrictedTo,
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

/**
 * We can also do like this to protect the routes coming below this middleware
 * router.use(protectedRoutes)
 */

router.route('/update-password').patch(protectedRoutes, updatePassword);
router.route('/current-user').get(protectedRoutes, getCurrentUserData, getUser);
router.route('/update-user-data').patch(protectedRoutes, updateUserData);
router.route('/delete-current-user').delete(protectedRoutes, deleteCurrentUser);

router.use(protectedRoutes, accessRestrictedTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
