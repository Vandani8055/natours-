// /////Error handling middlaeware:(central middleware) // 4 para means express know as error gandling middleware:

// const { Error } = require('mongoose');
// const AppError = require('./../utils/appError');

// //convert mongoose wierd error to own operational error:("handle invalid ID")
// const handleCastErrorDB = err => {
//     const message = `Invalid ${err.path} : ${err.value}.`;
//     return new AppError(message , 400);
// }

// //if fields unique then use this so not create same again throw that error:
// const handleDuplicateFieldsDB = err => {
//    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
// //    console.log(value);
//    const message = `Duplicate field value: ${value}. Please use another value!`;
//    return new AppError(message , 400);
// }


// const handleValidationErrorDB = err => {
//     const errors = Object.values(err.errors).map(val => val.message); // Using 'val.message'
//     const message = `Invalid input data. ${errors.join('. ')} `;
//     return new AppError(message , 400);
// }

// const handleJWTError = () => new AppError('Invalid token , Please log in again!' , 401);

// const handleJWTExpiredError = () => new AppError('Yout token has expired!. Please log in again!' , 401);



// const sendErrorDev = (err, req, res) => {
//   // A) API
//   if (req.originalUrl.startsWith('/api')) {
//     return res.status(err.statusCode).json({
//       status: err.status,
//       error: err,
//       message: err.message,
//       stack: err.stack
//     });
//   }

//   // B) RENDERED WEBSITE
//   console.error('ERROR 💥', err);
// //   Send generic message 
//   return res.status(err.statusCode).render('error', {
//     title: 'Something went wrong!',
//     msg: err.message
//   });
// };





// const sendErrorProd = (err, req, res) => {
//   // A) API ( //Operational error, trusted..error: sned message to client)
//   if (req.originalUrl.startsWith('/api')) {
//     // A) Operational, trusted error: send message to client
//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//       });
//     }
//     // B) Programming or other unknown error: don't leak error details
//     // 1) Log error
//     console.error('ERROR 💥', err);
//     // 2) Send generic message
//     return res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong!'
//     });
//   }

//   // B) RENDERED WEBSITE(Programming or Other error : dont' leak error details)
//   // A) Operational, trusted error: send message to client
//   if (err.isOperational) {
//     console.log(err);
//     return res.status(err.statusCode).render('error', {
//       title: 'Something went wrong!',
//       msg: err.message
//     });
//   }
//   // B) Programming or other unknown error: don't leak error details
//   // 1) Log error
//   console.error('ERROR 💥', err);
//   // 2) Send generic message
//   return res.status(err.statusCode).render('error', {
//     title: 'Something went wrong!',
//     msg: 'Please try again later.'
//   });
// };



// module.exports = (err, req, res ,next) =>{
//     // console.log(err.stack);
//     err.statusCode = err.statusCode || 500;         //internal server error
//     err.status = err.status || 'error';

//     if(process.env.NODE_ENV === 'development'){
//         sendErrorDev(err , req , res);
//     }
//     else if(process.env.NODE_ENV === 'production'){
//         let error = err;            //error = {...err} dont't be destuctor bcz shallow copy lost information.
//         // console.log(error);

//         if(error.name === 'CastError') error = handleCastErrorDB(error);
//         if(error.code === 11000) error = handleDuplicateFieldsDB(error);
//         if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
//         if(error.name === 'JsonWebTokenError') error = handleJWTError();
//         if(error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        
//         sendErrorProd(error, req , res);
//     }
// };









const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};