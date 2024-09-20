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
