/**
 * Global error handling
 *
 * Error handling middleware, it has 4 args (err, req, res, next)
 *
 * And express will automatically recognise it as an error handling middleware
 */

import AppError from '../utils/appError.js';

/** for invalid ids */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/** for duplicate field values */
const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue;
  const message = `Duplicate field value: ${JSON.stringify(
    value
  )} , Please use another value`;
  return new AppError(message, 400);
};

/** for validation error */

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)?.map((item) => item.message);

  const message = `Invalid input data: ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('Error -->', err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    // ### invalid id ###
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    // ### Duplicate fields ###
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    // ### validation error ###
    if (err._message.includes('validation')) {
      error = handleValidationErrorDB(error);
    }
    sendErrorForProd(error, res);
  }
};

export default globalErrorHandler;
