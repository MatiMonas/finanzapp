import { NextFunction, Request, Response } from 'express';
import { handleValidationErrors } from 'utils/helpers/functions';
import { SafeParseError, z } from 'zod';

export const createUserMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const CreateUserSchema = z.object({
    username: z
      .string()
      .min(1, 'Username is required')
      .min(2, 'Username must be at least 2 characters long')
      .max(25, 'Username must be at most 25 characters long'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .max(30, 'Email must be at most 30 characters long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[@$!%*?&#]/,
        'Password must contain at least one special character'
      ),
    roles: z
      .array(z.number())
      .nonempty('Roles must be a non-empty array of numbers'),
  });
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    return handleValidationErrors(result as SafeParseError<'error'>, req, res);
  }
  req.body = result.data;
  next();
};
