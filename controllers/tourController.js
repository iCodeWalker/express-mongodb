import { json } from 'stream/consumers';
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

    /**
     * Advance quering
     * Quering for <= or >= query values
     *
     * Mongodb query : { difficulty: easy, duration: { $gte : 5 }}
     * Query in url : 127.0.0.1:5000/api/v1/tours?duration[gte]=5&difficulty=easy&page=2&limit=10&sort=1
     *
     * we are going to replace gte with $gte, gt with $gt and similar
     */

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (matchedWord) => {
      return `$${matchedWord}`;
    });

    // 1. create a query
    let query = Tour.find(JSON.parse(queryStr));

    /**
     * 2) Sorting
     */

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // mongodb query : sorting using multiple variables sort(price ratingsAverage)
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    /**
     * 3) Field limiting
     */
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      //query = query.select('name duration price)
      query = query.select(fields);
    } else {
      // add - to exclude the field
      query = query.select('-__v');
    }

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
