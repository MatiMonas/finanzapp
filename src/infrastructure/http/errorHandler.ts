import env from 'utils/env';
import { NextFunction, Request, Response } from 'express';
import {
  ExceptionError,
  ExceptionValidationError,
} from 'errors/exceptionErrors';

const { NODE_ENV } = env;

export default function errorHandler(
  error: ExceptionError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ExceptionValidationError) {
    return res.status(400).json({ code: 400, errors: error.errors });
  }

  let { statusCode = 500, message } = error;

  if (statusCode === 500) {
    if (NODE_ENV !== 'production') console.log(error);

    message = 'Something went wrong.';
  }
  return res.status(statusCode).json({ code: statusCode, data: message });
}
