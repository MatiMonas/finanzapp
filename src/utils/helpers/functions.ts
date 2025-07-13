import { Request, Response } from 'express';
import { SafeParseError } from 'zod';
import moment from 'moment';

/**
 * Generates a validation error message for a given property based on its type and optional condition.
 *
 * This function creates a message string that describes the validation requirement for a property.
 * It helps ensure consistency and reusability of error messages across different schemas and validations.
 *
 * @param {string} property - The name of the property for which the validation message is being generated.
 * @param {string} type - The expected type of the property (e.g., 'number', 'string', 'boolean').
 * @param {string} [condition] - An optional additional condition for the validation message, such as 'positive' or 'non-empty'.
 *
 * @returns {string} - A formatted validation message string that describes the expected type and optional condition for the property.
 *
 * @example
 * // Example usage:
 * const message = getValidationMessage('age', 'number', 'positive');
 * console.log(message); // Output: 'Property "age" must be a number and positive'
 */
export const getValidationMessage = (
  property: string,
  type: string,
  condition?: string
) =>
  `Property "${property}" must be ${type}${
    condition ? ' and ' + condition : ''
  }`;

/**
 * Checks if a string is a valid date in the `YYYY-MM-DD` format.
 *
 * @param {string} val - The string to be checked.
 * @returns {boolean} `true` if the string is a valid date in the `YYYY-MM-DD` format, otherwise `false`.
 */
export const isValidDateFormat = (val: string): boolean => {
  return moment(val, 'YYYY-MM-DD', true).isValid();
};

/**
 * Handles validation errors by sending a JSON response with the validation errors and the input data.
 *
 * This function takes a `SafeParseError` object, a request object, and a response object.
 * It extracts the flattened validation errors from the `SafeParseError` object and
 * sends a JSON response with the validation errors and the input data.
 *
 * @param {SafeParseError<'error'>} result - The `SafeParseError` object containing the validation errors.
 * @param {Request<any, any, any, any>} req - The request object.
 * @param {Response} res - The response object.
 *
 * @returns {Response} - The JSON response with the validation errors and the input data.
 */
export const handleValidationErrors = (
  result: SafeParseError<'error'>,
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response
) => {
  const flattenedErrors = result.error.flatten();
  const fieldErrors = flattenedErrors.fieldErrors;
  const formErrors = flattenedErrors.formErrors;

  return res.status(400).json({
    status: 'fail',
    errors: {
      field_errors: fieldErrors || undefined,
      form_errors: formErrors.length > 0 ? formErrors : undefined,
    },
    input_data: {
      ...(typeof req.body === 'object' && req.body !== null ? req.body : {}),
      ...(typeof req.query === 'object' && req.query !== null ? req.query : {}),
    },
  });
};

export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 500
): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= retries) throw err;
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  // Esto no se ejecuta nunca, pero TypeScript lo quiere igual
  throw new Error('Unexpected retry failure');
}
