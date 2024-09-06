import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const createBudgetMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const CreateBudgetSchema = z.object({});
  const result = CreateBudgetSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ status: 'fail', errors: result.error.flatten() });
  }
  req.body = result.data;
  next();
};
