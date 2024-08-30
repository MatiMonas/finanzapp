import { IError } from 'errors';

class ExceptionValidationError extends Error {
  errors: IError;
  statusCode: number;
  constructor(message: string, errors: IError) {
    super(message);
    this.statusCode = 400;
    this.errors = errors;
  }
}

class ExceptionError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ExceptionError';
  }
}

export { ExceptionError, ExceptionValidationError };
