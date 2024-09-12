import BudgetRepository from 'domain/budgets/repository/budget-repository';
import { PostBudgetConfigurationParams } from 'domain/budgets/types/request';
import { ValidatorBudgetConfigurationNameInUse } from 'domain/budgets/validators/validatorBudgetConfigurationNameInUse';
import { BudgetConfigurationNameAlreadyInUseError } from 'errors';
import { ERROR_CODES, ERROR_NAMES, STATUS_CODES } from 'utils/constants';

const mockBudgetRepository = () => {
  return {
    findBudgetConfigurationByName: jest.fn(),
  };
};

describe('ValidatorBudgetConfigurationNameInUse', () => {
  let budgetRepository: jest.Mocked<BudgetRepository>;
  let validator: ValidatorBudgetConfigurationNameInUse;

  beforeEach(() => {
    budgetRepository =
      mockBudgetRepository() as unknown as jest.Mocked<BudgetRepository>;
    validator = new ValidatorBudgetConfigurationNameInUse(budgetRepository);
  });

  test('OK - Budget configuration name is not used', async () => {
    budgetRepository.findBudgetConfigurationByName.mockResolvedValueOnce(null);

    const body: PostBudgetConfigurationParams = {
      user_id: 'e4a24224-0d44-43c7-9873-497afaa31aaa',
      budget_configuration_name: 'Test',
      budgets: [
        {
          name: 'Alimentos',
          percentage: 100,
        },
      ],
    };

    const result = await validator.validate(body);
    expect(result).toEqual(body);
  });

  test('ERROR - BudgetConfigurationNameAlreadyInUseError when user wants to create new budget with existant name.', async () => {
    const budgetConfigurationResponse = {
      id: 9,
      user_id: 'e4a24224-0d44-43c7-9873-497afaa31aaa',
      name: 'Basico',
    };

    budgetRepository.findBudgetConfigurationByName.mockResolvedValueOnce(
      budgetConfigurationResponse
    );

    const body: PostBudgetConfigurationParams = {
      user_id: 'e4a24224-0d44-43c7-9873-497afaa31aaa',
      budget_configuration_name: 'Basico',
      budgets: [
        {
          name: 'Alimentos',
          percentage: 100,
        },
      ],
    };

    try {
      await validator.validate(body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(BudgetConfigurationNameAlreadyInUseError);
      expect(error.statusCode).toBe(STATUS_CODES.UNPROCESSABLE_ENTITY);
      expect(error.code).toBe(
        ERROR_CODES.BUDGET_CONFIGURATION_NAME_ALREADY_IN_USE_ERROR
      );
      expect(error.name).toBe(
        ERROR_NAMES.BUDGET_CONFIGURATION_NAME_ALREADY_IN_USE_ERROR
      );
      expect(error.message).toBe('Budget configuration name already in use');
    }
  });
});
