import { ERROR_CODES, ERROR_NAMES } from 'utils/constants';

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
  statusCode: 404,
  code: ERROR_CODES.USER_NOT_FOUND,
});

const EmailAlreadyInUseError = errorFactory({
  name: ERROR_NAMES.EMAIL_ALREADY_IN_USE,
  statusCode: 409,
  code: ERROR_CODES.EMAIL_ALREADY_IN_USE,
});

// Export the errors
export { UserNotFoundError, EmailAlreadyInUseError };
