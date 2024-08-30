import env from 'utils/env';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'errors';

const { NODE_ENV } = env;

interface ApiError extends Error {
  statusCode?: number;
}
export default function errorHandler(
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ code: 400, errors: error.errors });
  }

  let { statusCode = 500, message } = error;

  // TODO: rechek
  if (statusCode >= 500) {
    if (NODE_ENV !== 'production') console.log(error);

    message = 'An unexpected error has ocurred';
  }
  return res.status(statusCode).json({ status: 'failed', data: message });
}
