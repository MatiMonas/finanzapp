import { ERROR_CODES, ERROR_NAMES, STATUS_CODES } from 'utils/constants';

interface IValidationError {
  field: string;
  message: string;
}

export type IError = IValidationError[];

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

// ----- Validation Errors -------
export const BadRequestError = errorFactory({
  name: ERROR_NAMES.BAD_REQUEST_ERROR,
  statusCode: STATUS_CODES.BAD_REQUEST,
  code: ERROR_CODES.BAD_REQUEST_ERROR,
});

export const UserNotFoundError = errorFactory({
  name: ERROR_NAMES.USER_NOT_FOUND,
  statusCode: STATUS_CODES.NOT_FOUND,
  code: ERROR_CODES.USER_NOT_FOUND,
});

export const EmailAlreadyInUseError = errorFactory({
  name: ERROR_NAMES.EMAIL_ALREADY_IN_USE,
  statusCode: STATUS_CODES.CONFLICT,
  code: ERROR_CODES.EMAIL_ALREADY_IN_USE,
});

export const BudgetPercentageError = errorFactory({
  name: ERROR_NAMES.BUDGET_PERCENTAGE_ERROR,
  statusCode: STATUS_CODES.BAD_REQUEST,
  code: ERROR_CODES.BUDGET_PERCENTAGE_ERROR,
});

export const BudgetConfigurationNameAlreadyInUseError = errorFactory({
  name: ERROR_NAMES.BUDGET_CONFIGURATION_NAME_ALREADY_IN_USE_ERROR,
  statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
  code: ERROR_CODES.BUDGET_CONFIGURATION_NAME_ALREADY_IN_USE_ERROR,
});

export const BudgetsNotFoundError = errorFactory({
  name: ERROR_NAMES.BUDGETS_NOT_FOUND_ERROR,
  statusCode: STATUS_CODES.NOT_FOUND,
  code: ERROR_CODES.BUDGETS_NOT_FOUND_ERROR,
});

export const BudgetConfigurationNotFoundError = errorFactory({
  name: ERROR_NAMES.BUDGET_CONFIGURATION_NOT_FOUND_ERROR,
  statusCode: STATUS_CODES.NOT_FOUND,
  code: ERROR_CODES.BUDGET_CONFIGURATION_NOT_FOUND_ERROR,
});

export const WageAlreadyExistsError = errorFactory({
  name: ERROR_NAMES.MONTHLY_WAGE_ALREADY_EXISTS_ERROR,
  statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
  code: ERROR_CODES.MONTHLY_WAGE_ALREADY_EXISTS_ERROR,
});
// -------------------------------------

export const MissingMonthlyWageSummaryIdError = errorFactory({
  name: 'MISSING_MONTHLY_WAGE_SUMMARY_ID',
  statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
  code: 'MISSING_MONTHLY_WAGE_SUMMARY_ID',
});

export const DatabaseError = errorFactory({
  name: ERROR_NAMES.DATABASE_ERROR,
  statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
  code: ERROR_CODES.DATABASE_ERROR,
});
