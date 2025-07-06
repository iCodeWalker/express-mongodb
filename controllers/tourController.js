import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 *
 * Creating separate Route handlers
 */

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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
  const id = value * 1;
  const tour = tours.find((item) => item.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour',
    });
  }
  next();
};

/**
 * getAllTours : Route handler getting all tours
 */
export const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: { tours: tours },
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

  const id = req.params.id * 1;
  const tour = tours.find((item) => item.id === id);

  //   if (!tour) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid tour',
  //     });
  //   }

  res.status(200).json({ status: 'success', data: { tours: tour } });
};

/**
 * createTour : Route handler for creating a tour
 */

export const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
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
