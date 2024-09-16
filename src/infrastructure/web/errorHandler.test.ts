import { Request, Response, NextFunction } from 'express';
import errorHandler from './errorHandler';
import {
  ExceptionError,
  ExceptionValidationError,
} from 'errors/exceptionErrors';
import { DatabaseError } from 'errors';
import {
  ERROR_CODES,
  RESPONSE_STATUS,
  NODE_ENVIROMENTS,
} from 'utils/constants';

const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn() as NextFunction;

describe('errorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle ExceptionValidationError and return status code 400', () => {
    const validationError = new ExceptionValidationError('Validation failed', [
      { field: 'email', message: 'Email is required' },
    ]);

    errorHandler(validationError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: RESPONSE_STATUS.FAIL,
      code: ERROR_CODES.VALIDATION_ERROR,
      errors: validationError.errors,
    });
  });

  it('should handle DatabaseError and return status code 500', () => {
    const dbError = new DatabaseError('Database connection failed');

    errorHandler(dbError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: RESPONSE_STATUS.FAIL,
      message: 'Database connection failed',
      error_code: ERROR_CODES.DATABASE_ERROR,
    });
  });

  it('should handle a generic error and return status code 500', () => {
    const genericError = new ExceptionError('Something went wrong', 500);

    errorHandler(genericError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: RESPONSE_STATUS.FAIL,
      message: 'Something went wrong',
      error_code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
  });

  it('should log to console.error for 500 errors if not in production', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const serverError = new ExceptionError('Server error', 500);
    process.env.NODE_ENV = NODE_ENVIROMENTS.LOCAL;

    errorHandler(serverError, mockRequest, mockResponse, mockNext);

    expect(consoleSpy).toHaveBeenCalledWith(serverError);

    consoleSpy.mockRestore();
  });
});
