import dotenv from 'dotenv';
/**
 * This command will read the variables from the file and save them node js environment variable
 *
 * We have to configure the env file at the top so that it can be accessed in the below files.
 */
/**
 * Uncaught exceptions
 */

process.on('uncaughtException', (err) => {
  console.log(err, 'uncaughtException');
  // server.close(() => {
  process.exit(1); // 0 for success and 1 for uncaught exceptions
  // });
});

dotenv.config({ path: './.env' });

import app from './app.js';
import mongoose from 'mongoose';

/**
 * Setting up environment variables
 */

// console.log(app.get('env'));
// console.log(process.env);

/**
 * From terminal we can set it using cmd
 *
 * NODE_ENV=development X=23 nodemon server.js
 *
 * This will create variables in process.env with name "NODE_ENV" and value "development"
 */

/**
 * Configuring monogdb database
 */

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    sanitizeFilter: true,
  })
  .then((connectionObj) => {
    // console.log(connectionObj.connection);
    // console.log('DB connection successfull');
  })
  .catch((err) => {
    console.log('ERROR', err);
  });

/**
 * mongoose is all about models, and model is like a blueprint that we use to create documents, so it's like
 * a classes in javascript, that we use as a blueprint to create objects.
 *
 * So in mongoose we create models in order to create documents using it, and to also perform CRUD operations.
 *
 * And in order to create a model we need a schema.
 *
 * We use schema to create model out of it, and we use schema to describe type of our data,
 * to set default values, to validate the data etc.
 *
 */

const port = process.env.PORT || 5000;
/**
 * Listening
 */
const server = app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});

/**
 * Each time there is an unhandled rejection somewhere in our application, the process object will emit
 * an object called unhandled rejection, so we can subscribe to that event.
 *
 * Handled any unhanled promise rejection that we might not catch somewhere in the application
 */

process.on('unhandledRejection', (err) => {
  console.log(err, 'unhandledRejection');
  // first close the server.
  server.close(() => {
    process.exit(1); // 0 for success and 1 for uncaught exceptions
  });
});
