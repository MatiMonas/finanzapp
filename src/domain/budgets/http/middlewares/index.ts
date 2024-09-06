import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const createBudgetMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const CreateBudgetSchema = z.object({
    user_id: z.string().uuid('Invalid UUID format'),
    name: z
      .string()
      .min(1, 'Name is required')
      .max(30, 'Name must be at most 30 characters long'),
    percentage: z
      .number()
      .min(1, 'Percentage must be at least 1')
      .max(100, 'Percentage must be at most 100')
      .int('Percentage must be an integer'),
    transfer_to_budget: z.number().int('Transfer to budget must be an integer'),
  });

  const result = CreateBudgetSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ status: 'fail', errors: result.error.flatten() });
  }

  req.body = result.data;
  next();
};
