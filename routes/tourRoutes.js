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
} from '../controllers/tourController.js';

const router = express.Router();

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
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
