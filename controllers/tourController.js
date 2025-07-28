import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsyncError from '../utils/catchAsyncError.js';
import { deleteOne } from './handlerFactory.js';

/**
 * Aliasing
 */

export const aliasTopTours = (req, res, next) => {
  // #### query parameter is immutable now #####
  // req.query.limit = '5';
  // req.query.sort = '-ratingAverage,price';
  // req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  req.url =
    '/?sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary&limit=5';
  next();
};

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

    // const queryObj = { ...req.query };

    // exlcluded fields
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];

    // deleting keys that is not needed in the query object for filtering
    // excludeFields.forEach((item) => {
    //   delete queryObj[item];
    // });

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

    // let queryStr = JSON.stringify(queryObj);

    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (matchedWord) => {
    //   return `$${matchedWord}`;
    // });

    // 1. create a query
    // let query = Tour.find(JSON.parse(queryStr));

    /**
     * 2) Sorting
     */

    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   // mongodb query : sorting using multiple variables sort(price ratingsAverage)
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    /**
     * 3) Field limiting
     */
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   //query = query.select('name duration price)
    //   query = query.select(fields);
    // } else {
    //   // add - to exclude the field
    //   query = query.select('-__v');
    // }

    /**
     * 4) Pagination
     *
     * using page and limit query parameters
     * ?page=2&limit=10
     */

    // page 1 = 1-10, page 2 = 11-20, page 3 = 21-30
    // query = query.skip(10).limit(10)  skips 10 results before quering and sends 10 data objects

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;

    // const skipValue = (page - 1) * limit;

    // query = query.skip(skipValue).limit(limit);

    // if (req.query.page) {
    //   const numberOfTours = await Tour.countDocuments(); // returns number of documents
    //   if (skipValue >= numberOfTours) {
    //     throw new Error('The page does not exists');
    //   }
    // }

    // ################# Features #################
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    // 2. execute a query
    // const tours = await query;
    const tours = await features.query;

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
    console.log(err, 'features');
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

/**
 * getTour : Route handler for getting a single tour
 */

export const getTour = catchAsyncError(async (req, res, next) => {
  // const tour = await Tour.findById(req.params.id);
  // const tour = await Tour.findById(req.params.id);

  /**
   * Populating the guides (users) data into tours when ever the request is made
   *
   * Users will get populated into tours Only in the query and not into the actual database.
   */
  // const tour = await Tour.findById(req.params.id).populate({
  //   path: 'guides',
  //   select: '-__v -passwordChangedAt ',
  // });

  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) {
    return next(new AppError('No tour found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

// export const getTour = async (req, res) => {
//   try {
//     const tour = await Tour.findById(req.params.id);
//     // const tour = await Tour.findById(req.params.id);

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour: tour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

/**
 * Catching error in async functions
 */

/**
 * createTour : Route handler for creating a tour
 */

export const createTour = catchAsyncError(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

// export const createTour = async (req, res) => {
//   try {
//     // ### In this method we call the save method on the document ###
//     // const newTour = new Tour({})
//     // newTour.save()
//     // ### we can also create a tour using .create() method directly on the Tour model ####

//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

/**
 * updateTour : Route handler for updating a tour
 */

export const updateTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

// export const updateTour = async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour: tour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

/**
 * deleteTour : Route handler for deleting a tour
 */

// export const deleteTour = catchAsyncError(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

/**
 * Using function from handler factory
 */

export const deleteTour = deleteOne(Tour);

// export const deleteTour = async (req, res) => {
//   try {
//     await Tour.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

/**
 * Aggregation pipeline
 */

export const getTourStats = async (req, res) => {
  try {
    // It's just like doing a regular query, but the difference is, in aggregation we can manipulate the data
    // in couple of different stages

    // we define stages inside the array of 'aggregate' method

    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: null, // For having stats of all the data/tours
          // _id: '$difficulty',
          // _id: '$ratingsAverage',
          _id: {
            $toUpper: '$difficulty',
          },
          numberOfTours: {
            $sum: 1,
          },
          numberOfRating: {
            $sum: '$ratingsQuantity',
          },
          averageRating: {
            $avg: '$ratingsAverage',
          },
          averagePrice: {
            $avg: '$price',
          },
          minPrice: {
            $min: '$price',
          },
          maxPrice: {
            $max: '$price',
          },
        },
      },
      {
        $sort: {
          // Here we have to use the name that we have created in the above stage
          // 1 for asscending , -1 for descending
          averagePrice: 1,
        },
      },
      // {
      //   $match: {
      //     _id: { $ne: 'EASY' },
      //   },
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        tour: stats,
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
 * Unwinding and projecting
 *
 * Unwind : It deconstruct an array field from the documents and then output one document for each elemnt
 * of the array.
 * Now has one document for each of the 'startDates'
 */

export const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numberOfTours: {
            $sum: 1,
          },
          tours: {
            $push: '$name',
          },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numberOfTours: -1,
        },
      },
      {
        $limit: 12, // number of output data
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        tour: plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
