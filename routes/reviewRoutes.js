import express from 'express';
import {
  createReview,
  deleteReview,
  getAllReviews,
  setTourAndUserIds,
  updateReview,
} from '../controllers/reviewController.js';
import {
  protectedRoutes,
  accessRestrictedTo,
} from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });
/**
 * Each router only have access to the parameter of there specific routes.
 *
 * Here we have no "tourId" param, so in order to get access of "tourId" here we use { mergeParams: true }
 */

router
  .route('/')
  .get(protectedRoutes, getAllReviews)
  .post(
    protectedRoutes,
    accessRestrictedTo('user'),
    setTourAndUserIds,
    createReview
  );

router.route('/:id').patch(updateReview).delete(deleteReview);

export default router;
