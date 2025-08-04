import express from 'express';
import {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
} from '../controllers/viewController.js';
import { isLoggedIn, protectedRoutes } from '../controllers/authController.js';

const router = express.Router();

/** Middleware to check if a user is logged in */
// router.use(isLoggedIn);

router.get('/', isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/login', isLoggedIn, getLoginForm);

router.get('/current-user', protectedRoutes, getAccount);

export default router;
