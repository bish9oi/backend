import {ApiError} from './ApiError.js';

export const errorHandler = (err, req, res, next) => {
    //log the error
    console.error(err);
    //check if the error is an instance of ApiError
    if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      data: err.data,
      message: err.message,
      success: err.success,
      errors: err.errors,
    });
  }
    //if not an instance of ApiError, return a generic error response
   return res.status(500).json({
    statusCode: 500,
    data: null,
    message: "Internal Server Error",
    success: false,
    errors: [],
  });

    
}

