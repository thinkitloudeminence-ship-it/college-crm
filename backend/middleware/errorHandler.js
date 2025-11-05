// // @desc    Error handler middleware
// const errorHandler = (err, req, res, next) => {
//   let error = { ...err };
//   error.message = err.message;

//   // Log error for debugging
//   console.error('Error Details:', {
//     name: err.name,
//     message: err.message,
//     stack: err.stack,
//     code: err.code,
//     keyValue: err.keyValue
//   });

//   // Mongoose bad ObjectId
//   if (err.name === 'CastError') {
//     const message = 'Resource not found with the specified ID';
//     error = {
//       message,
//       statusCode: 404,
//       name: 'NotFoundError'
//     };
//   }

//   // Mongoose duplicate key error
//   if (err.code === 11000) {
//     const field = Object.keys(err.keyValue)[0];
//     const value = err.keyValue[field];
//     const message = `Duplicate field value: ${value} already exists for ${field}`;
//     error = {
//       message,
//       statusCode: 400,
//       name: 'DuplicateFieldError'
//     };
//   }

//   // Mongoose validation error
//   if (err.name === 'ValidationError') {
//     const messages = Object.values(err.errors).map(val => val.message);
//     const message = `Validation failed: ${messages.join(', ')}`;
//     error = {
//       message,
//       statusCode: 400,
//       name: 'ValidationError',
//       details: messages
//     };
//   }

//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     const message = 'Invalid token. Please provide a valid token.';
//     error = {
//       message,
//       statusCode: 401,
//       name: 'AuthenticationError'
//     };
//   }

//   if (err.name === 'TokenExpiredError') {
//     const message = 'Token expired. Please login again.';
//     error = {
//       message,
//       statusCode: 401,
//       name: 'AuthenticationError'
//     };
//   }

//   // Multer file upload errors
//   if (err.name === 'MulterError') {
//     let message = 'File upload error';
//     let statusCode = 400;

//     switch (err.code) {
//       case 'LIMIT_FILE_SIZE':
//         message = 'File too large. Maximum size is 10MB.';
//         statusCode = 413;
//         break;
//       case 'LIMIT_FILE_COUNT':
//         message = 'Too many files. Only one file allowed.';
//         break;
//       case 'LIMIT_UNEXPECTED_FILE':
//         message = 'Unexpected field in file upload.';
//         break;
//       default:
//         message = `File upload error: ${err.message}`;
//     }

//     error = {
//       message,
//       statusCode,
//       name: 'FileUploadError'
//     };
//   }

//   // Default to 500 server error
//   const statusCode = error.statusCode || 500;
//   const response = {
//     success: false,
//     message: error.message || 'Server Error',
//     error: error.name || 'InternalServerError'
//   };

//   // Include error details in development
//   if (process.env.NODE_ENV === 'development') {
//     response.stack = err.stack;
//     if (error.details) {
//       response.details = error.details;
//     }
//   }

//   // Include validation errors if any
//   if (error.details) {
//     response.details = error.details;
//   }

//   res.status(statusCode).json(response);
// };

// module.exports = errorHandler;


const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;