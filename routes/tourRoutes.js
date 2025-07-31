import express from 'express';

import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkTourId,
  checkBody,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithIn,
} from '../controllers/tourController.js';
import {
  accessRestrictedTo,
  protectedRoutes,
} from '../controllers/authController.js';
// import { createReview } from '../controllers/reviewController.js';
import reviewRouter from './reviewRoutes.js';

const router = express.Router();

/**
 * Nested routes
 */

// router
//   .route('/:tourId/reviews')
//   .post(protectedRoutes, accessRestrictedTo('user'), createReview);

/** Instead of using review controllers in the tour router we can mount a router here */
router.use('/:tourId/reviews', reviewRouter);

/**
 * creating param middleware, that runs on specific url with specific params
 *
 * In param middleware we have 4 parameters
 */
// router.param('id', checkTourId);

/**
 * Aliasing : quering using string name
 *
 * manupulating the req.query object using middleware
 */
router.route('/top-5-tours').get(aliasTopTours, getAllTours);

/**
 * Aggregate route : route for getting stats of tours
 */
router.route('/tour-stats').get(getTourStats);
/**
 * Unwinding and matching
 */
router
  .route('/monthly-plan/:year')
  .get(
    protectedRoutes,
    accessRestrictedTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );

/**
 * Route for getting tours in a certain location
 */

router
  .route('/tours-within/:distance/user-location/:latlng/unit/:unit')
  .get(getToursWithIn);
// we can also build url like this using query:  /tours-distance?distance=23&user-location=-40,45&unit=miles

router
  .route('/')
  .get(/*protectedRoutes,*/ getAllTours)
  .post(
    protectedRoutes,
    accessRestrictedTo('admin', 'lead-guide'),
    checkBody,
    createTour
  );
router
  .route('/:id')
  .get(getTour)
  .patch(protectedRoutes, accessRestrictedTo('admin', 'lead-guide'), updateTour)
  .delete(
    protectedRoutes,
    accessRestrictedTo('admin', 'lead-guide'),
    deleteTour
  );

export default router;
