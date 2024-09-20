import { NextFunction, Request, Response } from 'express';
import {
  getValidationMessage,
  isValidDateFormat,
} from 'utils/helpers/functions';
import { z } from 'zod';

export const getBudgetConfigurationsMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const BudgetConfigurationQuerySchema = z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID must be a number')
      .transform((val) => parseInt(val, 10))
      .optional(),
    name: z.string().optional(),
    user_id: z.string().uuid('Invalid UUID format').optional(),
    created_at: z
      .string()
      .refine((val) => isValidDateFormat(val), 'Invalid Date format')
      .optional(),
    updated_at: z
      .string()
      .refine((val) => isValidDateFormat(val), 'Invalid Date format')
      .optional(),
    deleted_at: z
      .string()
      .refine((val) => isValidDateFormat(val), 'Invalid Date format')
      .optional(),
  });

  const result = BudgetConfigurationQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res
      .status(400)
      .json({ status: 'fail', errors: result.error.flatten() });
  }

  req.query = result.data;
  next();
};

export const createBudgetConfigurationMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const BudgetItemSchema = z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(30, 'Name must be at most 30 characters long'),
    percentage: z
      .number()
      .min(1, 'Percentage must be at least 1')
      .max(100, 'Percentage must be at most 100')
      .int('Percentage must be an integer'),
  });

  const CreateBudgetSchema = z.object({
    user_id: z.string().uuid('Invalid UUID format'),
    budget_configuration_name: z
      .string()
      .min(1, 'Budget configuration name must be at least 1 character long')
      .max(50, 'Budget configuration name must be at most 50 characters long'),
    budgets: z
      .array(BudgetItemSchema)
      .nonempty('Budgets must be a non-empty array'),
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

export const patchBudgetConfigurationMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const BudgetItemSchema = z
    .object({
      id: z
        .number({ message: getValidationMessage('id', 'a number') })
        .positive('ID must be a positive number')
        .optional(),
      name: z
        .string({ message: getValidationMessage('name', 'a string') })
        .min(1, 'Name is required if property "name" is sent')
        .max(30, 'Name must be at most 30 characters long')
        .optional(),
      percentage: z
        .number({ message: getValidationMessage('percentage', 'a number') })
        .min(1, 'Percentage must be at least 1')
        .max(100, 'Percentage must be at most 100')
        .int('Percentage must be an integer')
        .optional(),
      create: z
        .boolean({ message: getValidationMessage('create', 'boolean') })
        .optional(),
      delete: z
        .boolean({ message: getValidationMessage('delete', 'boolean') })
        .optional(),
    })
    .refine((data) => !(data.create && data.delete), {
      message: 'Both create and delete cannot be true',
      path: ['budgets'],
    })
    .refine(
      (data) => data.delete || data.create || data.name || data.percentage,
      {
        message:
          'If delete or create are false/null, at least one of name or percentage must be provided',
        path: ['budgets'],
      }
    )
    .refine((data) => !(data.delete && (data.name || data.percentage)), {
      message: 'Cannot provide name or percentage when delete is true',
      path: ['budgets'],
    })
    .refine(
      (data) => {
        if (data.create) {
          return data.name && data.percentage;
        }
        return true;
      },
      {
        message:
          'Properties "name" and "percentage" must be provided if "create" is true',
        path: ['budgets'],
      }
    );

  const UpdateSchema = z
    .object({
      user_id: z
        .string({
          message: getValidationMessage(
            'user_id',
            'a UUID string',
            'is required'
          ),
        })
        .uuid('Invalid UUID format'),
      budget_configuration_name: z
        .string({
          message: getValidationMessage(
            'budget_configuration_name',
            'a string'
          ),
        })
        .min(1, 'Budget configuration name must be at least 1 character long')
        .max(50, 'Budget configuration name must be at most 50 characters long')
        .optional(),
      budgets: z
        .array(BudgetItemSchema)
        .nonempty('Budgets must be a non-empty array')
        .optional(),
    })
    .refine((data) => data.budgets || data.budget_configuration_name, {
      message: 'Either budgets or budget_configuration_name must be provided',
      path: ['missing_parameters'],
    });

  const result = UpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ status: 'fail', errors: result.error.flatten() });
  }

  req.body = result.data;
  next();
};

export const deleteBudgetConfigurationMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const DeleteSchema = z.object({
    user_id: z
      .string({
        message: getValidationMessage(
          'user_id',
          'a UUID string',
          'is required'
        ),
      })
      .uuid('Invalid UUID format'),
  });

  const result = DeleteSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ status: 'fail', errors: result.error.flatten() });
  }

  req.body = result.data;
  next();
};
