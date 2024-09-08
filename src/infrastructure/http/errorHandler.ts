import env from 'utils/env';
import { NextFunction, Request, Response } from 'express';
import {
  ExceptionError,
  ExceptionValidationError,
} from 'errors/exceptionErrors';
import { DatabaseError } from 'errors';
import {
  ERROR_CODES,
  NODE_ENVIROMENTS,
  RESPONSE_STATUS,
} from 'utils/constants';

const { NODE_ENV } = env;

interface ApiError extends Error {
  statusCode: number;
  code: string;
  cause?: Error;
}

export default function errorHandler(
  error: ExceptionError | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ExceptionValidationError) {
    return res.status(400).json({
      status: RESPONSE_STATUS.FAIL,
      code: ERROR_CODES.VALIDATION_ERROR,
      errors: error.errors,
    });
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || 'An unexpected error occurred.';
  let code = (error as ApiError).code || ERROR_CODES.INTERNAL_SERVER_ERROR;

  if (error instanceof DatabaseError) {
    statusCode = (error as ApiError).statusCode;
    code = (error as ApiError).code || ERROR_CODES.DATABASE_ERROR;
  }

  if (statusCode === 500 && NODE_ENV !== NODE_ENVIROMENTS.PRODUCTION) {
    console.error(error);
  }

  return res
    .status(statusCode)
    .json({ status: RESPONSE_STATUS.FAIL, message, error_code: code });
}
