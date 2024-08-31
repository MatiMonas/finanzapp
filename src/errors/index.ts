import { ERROR_CODES, ERROR_NAMES, ERROR_STATUS_CODES } from 'utils/constants';

export interface IError {
  [error: string]: string[];
}

interface ErrorFactoryOptions {
  cause?: Error;
  errors?: IError;
}

interface ErrorFactoryParams {
  name: string;
  statusCode: number;
  code: string;
}

const errorFactory = ({ name, statusCode, code }: ErrorFactoryParams) => {
  return class ApiError extends Error {
    statusCode: number;
    code: string;
    cause?: Error;

    constructor(message: string, options: ErrorFactoryOptions = {}) {
      super(message);
      this.name = name;
      this.statusCode = statusCode;
      this.code = code;
      this.cause = options.cause;
    }
  };
};

const UserNotFoundError = errorFactory({
  name: ERROR_NAMES.USER_NOT_FOUND,
  statusCode: ERROR_STATUS_CODES.NOT_FOUND,
  code: ERROR_CODES.USER_NOT_FOUND,
});

const EmailAlreadyInUseError = errorFactory({
  name: ERROR_NAMES.EMAIL_ALREADY_IN_USE,
  statusCode: ERROR_STATUS_CODES.CONFLICT,
  code: ERROR_CODES.EMAIL_ALREADY_IN_USE,
});

const DatabaseError = errorFactory({
  name: ERROR_NAMES.DATABASE_ERROR,
  statusCode: ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR,
  code: ERROR_CODES.DATABASE_ERROR,
});

// Export the errors
export { UserNotFoundError, EmailAlreadyInUseError, DatabaseError };
