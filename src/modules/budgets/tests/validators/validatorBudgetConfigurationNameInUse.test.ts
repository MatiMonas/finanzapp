import BudgetRepository from 'modules/budgets/repository/budget-repository';
import { PostBudgetConfigurationBody } from 'modules/budgets/types/request';
import { ValidatorBudgetConfigurationNameInUse } from 'modules/budgets/validators/validatorBudgetConfigurationNameInUse';
import { BudgetConfigurationNameAlreadyInUseError } from 'errors';
import { ERROR_CODES, ERROR_NAMES, STATUS_CODES } from 'utils/constants';
import { mockBudgetRepository } from '__mocks__/Budget';

describe('ValidatorBudgetConfigurationNameInUse', () => {
  let validator: ValidatorBudgetConfigurationNameInUse;

  beforeEach(() => {
    validator = new ValidatorBudgetConfigurationNameInUse(mockBudgetRepository);
  });

  test('OK - Budget configuration name is not used', async () => {
    (
      mockBudgetRepository.findBudgetConfigurationWhere as jest.Mock
    ).mockResolvedValueOnce([]);

    const body: PostBudgetConfigurationBody = {
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
    const budgetConfigurationResponse = [
      {
        id: 9,
        user_id: 'e4a24224-0d44-43c7-9873-497afaa31aaa',
        name: 'Basico',
      },
    ];

    (
      mockBudgetRepository.findBudgetConfigurationWhere as jest.Mock
    ).mockResolvedValueOnce(budgetConfigurationResponse);

    const body: PostBudgetConfigurationBody = {
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
