import { Request, Response, NextFunction } from 'express';

import createHandler from 'infrastructure/web/createHandler';

describe('createHandler', () => {
  const mockSuccessHandler = jest.fn();

  const mockErrorHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success status with data property', async () => {
    const mockData = { data: 'some data' };

    mockSuccessHandler.mockResolvedValue(mockData);

    const req = {} as Request;

    const res = {
      status: jest.fn().mockReturnThis(),

      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    const handler = createHandler(mockSuccessHandler);

    await handler(req, res, next);

    expect(mockSuccessHandler).toHaveBeenCalledWith(req);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({ status: 'success', ...mockData });

    expect(next).not.toHaveBeenCalled();
  });

  it('should return success status without data property', async () => {
    const mockData = { message: 'success' };

    mockSuccessHandler.mockResolvedValue(mockData);

    const req = {} as Request;

    const res = {
      status: jest.fn().mockReturnThis(),

      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    const handler = createHandler(mockSuccessHandler);

    await handler(req, res, next);

    expect(mockSuccessHandler).toHaveBeenCalledWith(req);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',

      data: mockData,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('should pass error to next middleware if handler throws an error', async () => {
    const error = new Error('Something went wrong');

    mockSuccessHandler.mockRejectedValue(error);

    const req = {} as Request;

    const res = {} as Response;

    const next = jest.fn() as NextFunction;

    const handler = createHandler(mockSuccessHandler);

    await handler(req, res, next);

    expect(mockSuccessHandler).toHaveBeenCalledWith(req);

    expect(next).toHaveBeenCalledWith(error);
  });
});
