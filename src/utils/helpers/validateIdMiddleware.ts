import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateIdMiddleware = (
  req: Request<{ id: string }, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const idSchema = z.number().positive('ID must be a positive number');

  const parseId = z.string().transform((val) => {
    const parsed = Number(val);
    if (isNaN(parsed)) {
      throw new Error('ID must be a number');
    }
    return parsed;
  });

  try {
    const parsedId = parseId.parse(req.params.id);
    idSchema.parse(parsedId);
    next();
  } catch (error: any) {
    return res.status(400).json({
      status: 'fail',
      errors: {
        message: error.message || 'Invalid ID',
      },
    });
  }
};
