import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { MongoError } from 'mongodb';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // Default error
  let error = err instanceof AppError ? err : new AppError(err.message || 'Internal Server Error', 500);

  // Handle MongoDB specific errors
  if (err instanceof MongoError) {
    switch (err.code) {
      case 11000:
        error = new AppError('Duplicate field value', 400);
        break;
      default:
        error = new AppError('Database error', 500);
    }
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    error = new AppError('Invalid JSON format', 400);
  }

  // Handle validation errors (mongoose)
  if (err.name === 'ValidationError') {
    error = new AppError(err.message, 400);
  }

  // Development vs Production error response
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: error.stack,
      error: err
    });
  } else {
    // Production: don't leak error details
    res.status(error.statusCode).json({
      status: error.status,
      message: error.isOperational ? error.message : 'Something went wrong'
    });
  }
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
