import env from 'utils/env';
import { NextFunction, Request, Response } from 'express';
import {
  ExceptionError,
  ExceptionValidationError,
} from 'errors/exceptionErrors';
import { DatabaseError } from 'errors';

const { NODE_ENV } = env;

export default function errorHandler(
  error: ExceptionError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ExceptionValidationError) {
    return res.status(400).json({ status: 'fail', errors: error.errors });
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || 'An unexpected error occurred.';

  if (error instanceof DatabaseError) {
    statusCode = error.statusCode;
    message = 'An unexpected error occurred. Please try again later.';
  }

  if (statusCode === 500 && NODE_ENV !== 'production') {
    console.error(error);
  }

  return res.status(statusCode).json({ status: 'fail', message });
}
