/**
 * Global error handling
 *
 * Error handling middleware, it has 4 args (err, req, res, next)
 *
 * And express will automatically recognise it as an error handling middleware
 */

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default globalErrorHandler;
