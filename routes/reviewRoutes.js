import express from 'express';
import {
  createReview,
  getAllReviews,
} from '../controllers/reviewController.js';
import {
  protectedRoutes,
  accessRestrictedTo,
} from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(protectedRoutes, getAllReviews)
  .post(protectedRoutes, accessRestrictedTo('user'), createReview);

export default router;
