import express from 'express';
import {
  getOverview,
  getTour,
  getLoginForm,
} from '../controllers/viewController.js';
import { isLoggedIn, protectedRoutes } from '../controllers/authController.js';

const router = express.Router();

/** Middleware to check if a user is logged in */
router.use(isLoggedIn);

router.get('/', getOverview);

router.get('/tour/:slug', getTour);

router.get('/login', getLoginForm);

export default router;
