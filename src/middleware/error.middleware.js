const ApiError = require('../utils/api-error');

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    details: error.details || null
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
