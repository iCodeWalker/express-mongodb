import express from 'express';

import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkTourId,
  checkBody,
} from '../controllers/tourController.js';

const router = express.Router();

/**
 * creating param middleware, that runs on specific url with specific params
 *
 * In param middleware we have 4 parameters
 */
// router.param('id', checkTourId);

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
