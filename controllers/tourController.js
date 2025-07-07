import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Tour from '../models/tourModel.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

/**
 *
 * Creating separate Route handlers
 */

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

/**
 * checkBody : Check body middleware
 */

export const checkBody = (req, res, next, value) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing price or name',
    });
  }
  next();
};

/**
 *  checkTourId : param middleware
 */

export const checkTourId = (req, res, next, value) => {
  // const id = value * 1;
  // const tour = tours.find((item) => item.id === id);

  // if (!tour) {
  return res.status(404).json({
    status: 'fail',
    message: 'Invalid tour',
  });
  // }
  next();
};

/**
 * getAllTours : Route handler getting all tours
 */
export const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
  });
};

/**
 * getTour : Route handler for getting a single tour
 */

export const getTour = (req, res) => {
  /**
   * req.params is where all the params are stored
   */
  // console.log(req.params)

  // const id = req.params.id * 1;
  // const tour = tours.find((item) => item.id === id);

  //   if (!tour) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid tour',
  //     });
  //   }

  res.status(200).json({ status: 'success' });
};

/**
 * createTour : Route handler for creating a tour
 */

export const createTour = async (req, res) => {
  try {
    // ### In this method we call the save method on the document ###
    // const newTour = new Tour({})
    // newTour.save()
    // ### we can also create a tour using .create() method directly on the Tour model ####

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

/**
 * updateTour : Route handler for updating a tour
 */

export const updateTour = (req, res) => {
  //   const id = req.params.id * 1;
  //   const tour = tours.find((item) => item.id === id);

  //   if (!tour) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid tour',
  //     });
  //   }

  res.status(200).json({
    status: 'success',
    data: {
      tours: 'Tour updated successfully',
    },
  });
};

/**
 * deleteTour : Route handler for deleting a tour
 */

export const deleteTour = (req, res) => {
  //   const id = req.params.id * 1;
  //   const tour = tours.find((item) => item.id === id);

  //   if (!tour) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid tour',
  //     });
  //   }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
