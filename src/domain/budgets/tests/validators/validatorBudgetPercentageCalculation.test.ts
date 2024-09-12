import { IBudgetRepository } from 'domain/budgets/repository/budget-repository';
import { PatchBudgetParams } from 'domain/budgets/types/request';
import { ValidatorBudgetPercentageCalculation } from 'domain/budgets/validators/validatorBudgetPercentageCalculation';
import { BudgetPercentageError, BudgetsNotFoundError } from 'errors';
import { ERROR_CODES, ERROR_NAMES, STATUS_CODES } from 'utils/constants';

describe('ValidatorBudgetPercentageCalculation', () => {
  let budgetRepositoryMock: jest.Mocked<IBudgetRepository>;
  let validator: ValidatorBudgetPercentageCalculation;

  beforeEach(() => {
    budgetRepositoryMock = {
      getBudgetsByConfigurationId: jest.fn(),
    } as unknown as jest.Mocked<IBudgetRepository>;

    validator = new ValidatorBudgetPercentageCalculation(budgetRepositoryMock);
  });

  it('Should validate and pass when deleting a budget and total remains 100%', async () => {
    const budget = {
      id: 1,
      name: 'Savings',
      percentage: 30,
      remaining_allocation: 0,
      budget_configuration_id: 1,
      transfer_to_budget_id: null,
      monthly_wage_id: null,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const budget2 = { ...budget };
    budget2.id = 2;
    (budget2.name = 'Housing'), (budget2.percentage = 70);

    budgetRepositoryMock.getBudgetsByConfigurationId.mockResolvedValue([
      budget,
      budget2,
    ]);

    const body: PatchBudgetParams = {
      user_id: budget.user_id,
      budget_configuration_id: 1,
      budgets: [
        { id: 1, percentage: 100 },
        { id: 2, delete: true },
      ],
    };

    const result = await validator.validate(body);
    expect(result).toEqual(body);
  });

  it('Should validate and pass when creating a new budget and total stays 100%', async () => {
    const budget = {
      id: 1,
      name: 'Savings',
      percentage: 60,
      remaining_allocation: 0,
      budget_configuration_id: 1,
      transfer_to_budget_id: null,
      monthly_wage_id: null,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const budget2 = { ...budget };
    budget2.id = 2;
    (budget2.name = 'Housing'), (budget2.percentage = 20);
    const budget3 = { ...budget };
    budget3.id = 3;
    (budget3.name = 'Food'), (budget3.percentage = 20);

    budgetRepositoryMock.getBudgetsByConfigurationId.mockResolvedValue([
      budget,
      budget2,
      budget3,
    ]);

    const body: PatchBudgetParams = {
      user_id: budget.user_id,
      budget_configuration_id: 1,
      budgets: [
        { id: 2, delete: true },
        { id: 3, delete: true },
        { create: true, name: 'Life', percentage: 40 },
      ],
    };
    const result = await validator.validate(body);
    expect(result).toEqual(body);
  });

  it('Should validate and pass when updating a budget and total remains 100%', async () => {
    const budget = {
      id: 1,
      name: 'Savings',
      percentage: 60,
      remaining_allocation: 0,
      budget_configuration_id: 1,
      transfer_to_budget_id: null,
      monthly_wage_id: null,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const budget2 = { ...budget };
    budget2.id = 2;
    (budget2.name = 'Housing'), (budget2.percentage = 40);

    budgetRepositoryMock.getBudgetsByConfigurationId.mockResolvedValue([
      budget,
      budget2,
    ]);

    const body: PatchBudgetParams = {
      user_id: budget.user_id,
      budget_configuration_id: 1,
      budgets: [
        { id: 2, percentage: 30 },
        { id: 1, percentage: 70 },
      ],
    };

    const result = await validator.validate(body);
    expect(result).toEqual(body);
  });

  it('Should pass validation when updating the name of a budget without changing percentage', async () => {
    const budget = {
      id: 1,
      name: 'Savings',
      percentage: 60,
      remaining_allocation: 0,
      budget_configuration_id: 1,
      transfer_to_budget_id: null,
      monthly_wage_id: null,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const budget2 = { ...budget };
    budget2.id = 2;
    (budget2.name = 'Housing'), (budget2.percentage = 40);

    budgetRepositoryMock.getBudgetsByConfigurationId.mockResolvedValue([
      budget,
      budget2,
    ]);
    const body: PatchBudgetParams = {
      user_id: budget.user_id,
      budget_configuration_id: 1,
      budgets: [{ id: 1, name: 'New Housing Name' }],
    };

    const result = await validator.validate(body);
    expect(result).toEqual(body);
  });

  it('ERROR - Should throw BudgetsNotFoundError when no budgets are found', async () => {
    budgetRepositoryMock.getBudgetsByConfigurationId.mockResolvedValue([]);

    const body: PatchBudgetParams = {
      user_id: 'someUUID',
      budget_configuration_id: 1,
      budgets: [{ id: 1, percentage: 70 }],
    };

    try {
      await validator.validate(body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(BudgetsNotFoundError);
      expect(error.statusCode).toBe(STATUS_CODES.NOT_FOUND);
      expect(error.code).toBe(ERROR_CODES.BUDGETS_NOT_FOUND_ERROR);
      expect(error.name).toBe(ERROR_NAMES.BUDGETS_NOT_FOUND_ERROR);
      expect(error.message).toBe('No budgets found');
    }
  });

  it('ERROR - Should throw BudgetPercentageError when total percentage exceeds 100%', async () => {
    const budget = {
      id: 1,
      name: 'Savings',
      percentage: 60,
      remaining_allocation: 0,
      budget_configuration_id: 1,
      transfer_to_budget_id: null,
      monthly_wage_id: null,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const budget2 = { ...budget };
    budget2.id = 2;
    (budget2.name = 'Housing'), (budget2.percentage = 40);

    budgetRepositoryMock.getBudgetsByConfigurationId.mockResolvedValue([
      budget,
      budget2,
    ]);

    const body: PatchBudgetParams = {
      user_id: budget.user_id,
      budget_configuration_id: 1,
      budgets: [{ id: 1, percentage: 70 }],
    };

    try {
      await validator.validate(body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(BudgetPercentageError);
      expect(error.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
      expect(error.code).toBe(ERROR_CODES.BUDGET_PERCENTAGE_ERROR);
      expect(error.name).toBe(ERROR_NAMES.BUDGET_PERCENTAGE_ERROR);
      expect(error.message).toBe(
        'The total percentage must be 100%. Current total: 110%'
      );
    }
  });

  it('ERROR - Should throw BudgetPercentageError when total percentage is less than 100%', async () => {
    const budget = {
      id: 1,
      name: 'Savings',
      percentage: 60,
      remaining_allocation: 0,
      budget_configuration_id: 1,
      transfer_to_budget_id: null,
      monthly_wage_id: null,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const budget2 = { ...budget };
    budget2.id = 2;
    (budget2.name = 'Housing'), (budget2.percentage = 40);

    budgetRepositoryMock.getBudgetsByConfigurationId.mockResolvedValue([
      budget,
      budget2,
    ]);

    const body: PatchBudgetParams = {
      user_id: budget.user_id,
      budget_configuration_id: 1,
      budgets: [{ id: 1, percentage: 40 }],
    };

    try {
      await validator.validate(body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(BudgetPercentageError);
      expect(error.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
      expect(error.code).toBe(ERROR_CODES.BUDGET_PERCENTAGE_ERROR);
      expect(error.name).toBe(ERROR_NAMES.BUDGET_PERCENTAGE_ERROR);
      expect(error.message).toBe(
        'The total percentage must be 100%. Current total: 80%'
      );
    }
  });
});
