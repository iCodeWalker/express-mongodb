import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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
 * By default express does not put the body data on the request parameter, we have to do it using a middleware
 * express.json() is a middleware that puts the body data on the req object
 */
app.use(express.json());

/**
 * Serving static file present on our system
 * Works only for static file
 * We will be using a middleware
 */

app.use(express.static(`${__dirname}/public`));

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
 * Handling Unhandled routes
 *
 * all -> points to all http methods. Ex: get,post,put,patch,delete etc
 */

app.all('/{*any}', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl}`,
  });
});

export default app;

// const port = 5000;
// /**
//  * Listening
//  */
// app.listen(port, () => {
//   console.log(`Started listening on port ${port}`);
// });
