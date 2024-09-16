import { PostBudgetConfigurationBody } from 'domain/budgets/types/request';
import { ValidatorBudgetPercentage } from 'domain/budgets/validators/validatorBudgetPercentage';
import { BudgetPercentageError } from 'errors';
import { ERROR_CODES, ERROR_NAMES, STATUS_CODES } from 'utils/constants';

describe('ValidatorBudgetPercentage', () => {
  let validator: ValidatorBudgetPercentage;

  beforeEach(() => {
    validator = new ValidatorBudgetPercentage();
  });

  test('OK - Budget percentages sums equal 100', async () => {
    const body: PostBudgetConfigurationBody = {
      user_id: 'e4a24224-0d44-43c7-9873-497afaa31aaa',
      budget_configuration_name: 'Test',
      budgets: [
        {
          name: 'Alimentos',
          percentage: 50,
        },
        {
          name: 'Ahorros',
          percentage: 50,
        },
      ],
    };

    const result = await validator.validate(body);
    expect(result).toEqual(body);
  });

  test('ERROR - BudgetConfigurationNameAlreadyInUseError when user wants to create new budget with existant name.', async () => {
    const body: PostBudgetConfigurationBody = {
      user_id: 'e4a24224-0d44-43c7-9873-497afaa31aaa',
      budget_configuration_name: 'Basico',
      budgets: [
        {
          name: 'Alimentos',
          percentage: 50,
        },
        {
          name: 'Ahorros',
          percentage: 60,
        },
      ],
    };

    try {
      await validator.validate(body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(BudgetPercentageError);
      expect(error.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
      expect(error.code).toBe(ERROR_CODES.BUDGET_PERCENTAGE_ERROR);
      expect(error.name).toBe(ERROR_NAMES.BUDGET_PERCENTAGE_ERROR);
      expect(error.message).toBe('Budget total percentage must be 100%');
    }
  });
});
