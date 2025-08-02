import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Setting template engine
 */
app.set('view engine', 'pug');
/** Where the template files are located in our file system */
app.set('views', path.join(__dirname, 'views'));
/**
 * Serving static file present on our system
 * Works only for static file
 * We will be using a middleware
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * setting security header
 */
app.use(helmet());

/**
 * allows us to use nested objects in the URL
 *
 * To get nested req.query object we set this
 */
app.set('query parser', 'extended');
/**
 * 3rd party middleware morgan : used to log requests
 */

/**
 * Logging to be done only when we are in development env
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Rate limiter:
 *
 * When we are getting multiple requests in a short span of time from the same IP, than we have to limit the number req to save
 * our server from brute force attack.
 */
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests. Please try again after some time. ',
});

app.use('/api', limiter);

/**
 * By default express does not put the body data on the request parameter, we have to do it using a middleware
 * express.json() is a middleware that puts the body data on the req object
 */
app.use(express.json());

/** Data sanitisation */

// 1. Against NoSQL query injection

// ################### use moongose built in 'sanitizeFilter' ###################
// Apply mongo-sanitize safely without mutating req.query

/** Function to sanitize query */
function sanitize(obj) {
  if (typeof obj !== 'object' || obj === null || obj == {}) return obj;

  const clean = {};
  for (const key in obj) {
    const newKey = key.replace(/\$/g, '_').replace(/\./g, '_');
    clean[newKey] = sanitize(obj[key]);
  }
  return clean;
}

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);

  // Manually sanitize query if needed
  if (req.query) {
    try {
      // req.query = sanitize({ ...req.query }); // Safe clone
    } catch (err) {
      console.warn('Query sanitize failed:', err);
    }
  }

  next();
});

// 2. Against XSS (cross site scripting attack)
app.use(xss());

/**
 * Preventing parameter pollutions
 */
// ### Whitelisting parameters ###
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

/**
 * Serving static file present on our system
 * Works only for static file
 * We will be using a middleware
 */

// app.use(express.static(`${__dirname}/public`));

/**
 *
 * Creating custom middleware
 */

// app.use((req, res, next) => {
//   console.log('From middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/**
 * Read the data from "dev-data"
 */

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/**
 *
 * Refactoring our code
 *
 * Creating separate Route handlers
 */

/**
 * getAllTours : Route handler getting all tours
 */
const getAllTours = (req, res) => {
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

const getTour = (req, res) => {
  /**
   * req.params is where all the params are stored
   */
  // console.log(req.params)
  const id = req.params.id * 1;
  const tour = tours.find((item) => item.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour',
    });
  }

  res.status(200).json({ status: 'success', data: { tours: tour } });
};

/**
 * createTour : Route handler for creating a tour
 */

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((item) => item.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour',
    });
  }

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

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((item) => item.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

/**
 * Route handlers of Users
 */

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not in use',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not in use',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not in use',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not in use',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not in use',
  });
};

/**
 * Route for accessing templates
 */
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'New tour',
    user: 'vaibhav',
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All tours',
    user: 'vaibhav',
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'Forest hiker',
    user: 'vaibhav',
  });
});

/**
 * GET http method : getting all tours data
 *
 */
// app.get('/api/v1/tours', getAllTours);

/**
 * POST http method
 */
// app.post('/api/v1/tours', getTour);

/**
 * GET http method : getting data of single tour
 * adding dynamic variable to url
 *
 */
// app.get('/api/v1/tours/:id', createTour);

/**
 * PATCH http method
 */

// app.patch('/api/v1/tours/:id', updateTour);

/**
 * DELETE http method
 *
 * When delete is success we send 204 status and data as null, simply to show that the data we deleted no
 * longer exists
 *
 */

// app.delete('/api/v1/tours/:id', deleteTour);

/**
 * Route method :  used for chaning http methodds
 */

// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

/**
 * Creating multiple routers
 *
 * To connect these new router we can use it as a middleware
 */

// const tourRouter = express.Router();

// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.use('/api/v1/tours', tourRouter);

/**
 *
 * Users route
 */

// app.route('/api/v1/users').get(getAllUsers).post(createUser);

// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

// const userRouter = express.Router();

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/users', userRouter);

/**
 * Review routes
 */

app.use('/api/v1/reviews', reviewRouter);

/**
 * Handling Unhandled routes
 *
 * all -> points to all http methods. Ex: get,post,put,patch,delete etc
 */

app.all('/{*any}', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  // const error = new Error(`Can't find ${req.originalUrl} `);
  // error.status = 'fail';
  // error.statusCode = 404;

  /** Whenever something is passed in next() as an argument, the express will treat it as if there is an error
   *
   * Express will than skio all the remaining middleware, and send the error we passed in to the
   * global error handling middleware
   */
  // next(error);
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

/**
 * Global error handling
 *
 * Error handling middleware, it has 4 args (err, req, res, next)
 *
 * And express will automatically recognise it as an error handling middleware
 */

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.use(globalErrorHandler);

export default app;

// const port = 5000;
// /**
//  * Listening
//  */
// app.listen(port, () => {
//   console.log(`Started listening on port ${port}`);
// });
