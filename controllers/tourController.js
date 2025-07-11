import Tour from '../models/tourModel.js';

/**
 *
 * Creating separate Route handlers
 */

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
export const getAllTours = async (req, res) => {
  try {
    /**
     * Get all tours
     */
    // const tours = await Tour.find();

    /**
     * Filtering:
     *
     * query string :Ex ?duration=5&difficulty=easy
     */

    /**
     * Quering using filter object
     */

    // const tours = await Tour.find({ duratiion: 5, difficulty: 'easy' });

    const queryObj = { ...req.query };

    // exlcluded fields
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    // deleting keys that is not needed in the query object for filtering
    excludeFields.forEach((item) => {
      delete queryObj[item];
    });

    // const tours = await Tour.find(req.query);
    // const tours = await Tour.find(queryObj);

    // 1. create a query
    const query = Tour.find(queryObj);

    // 2. execute a query
    const tours = await query;

    /**
     * Quering using mongoose methods
     *
     */

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
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
 * getTour : Route handler for getting a single tour
 */

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
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

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
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
 * deleteTour : Route handler for deleting a tour
 */

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
