// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Default error
  let error = {
    success: false,
    message: 'Internal server error',
    status: 500
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = 'Validation failed';
    error.errors = messages;
    error.status = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = 'Resource already exists';
    error.status = 409;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.status = 400;
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.status = 401;
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.status = 401;
  }

  // Send error response
  res.status(error.status).json({
    success: false,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
}; 