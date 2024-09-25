import { BudgetConfigurationNotFoundError } from 'errors';
import { mockBudgetRepository } from '__mocks__/Budget';
import { DeleteBudgetConfigurationPayload } from 'modules/budgets/types/request';
import { ValidatorIsBudgetConfigurationFromUser } from 'modules/budgets/validators/validatorIsBudgetConfigurationFromUser';
import { ERROR_CODES, ERROR_NAMES, STATUS_CODES } from 'utils/constants';

describe('ValidatorIsBudgetConfigurationFromUser', () => {
  let validator: ValidatorIsBudgetConfigurationFromUser;

  beforeEach(() => {
    validator = new ValidatorIsBudgetConfigurationFromUser(
      mockBudgetRepository
    );
  });

  it('OK - Budget Configuration belongs to user', async () => {
    const body: DeleteBudgetConfigurationPayload = {
      budget_configuration_id: 1,
      user_id: 'user-id-1',
    };

    (
      mockBudgetRepository.findBudgetConfigurationWhere as jest.Mock
    ).mockResolvedValue([
      {
        id: 1,
        name: 'ActiveBudgetConfig',
        user_id: '17ed324a-4513-4685-b023-facdb0a4b070',
        created_at: '2024-09-16T23:29:43.897Z',
        updated_at: '2024-09-16T23:29:43.897Z',
        deleted_at: null,
        budgets: [
          {
            id: 1,
            user_id: 'c4493c68-38c8-4106-a47a-b9694d01b751',
            name: 'test',
            percentage: 100,
            remaining_allocation: 0,
            budget_configuration_id: 1,
            transfer_to_budget_id: null,
            monthly_wage_id: null,
            created_at: '2024-09-16T23:30:34.253Z',
            updated_at: '2024-09-16T23:30:34.253Z',
            deleted_at: null,
          },
        ],
      },
    ]);

    const result = await validator.validate(body);
    expect(result).toEqual(body);
  });

  it('ERROR - Budget Configuration does not belong to user', async () => {
    const body: DeleteBudgetConfigurationPayload = {
      budget_configuration_id: 1,
      user_id: 'user-id-1',
    };

    (
      mockBudgetRepository.findBudgetConfigurationWhere as jest.Mock
    ).mockResolvedValue([]);

    try {
      await validator.validate(body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(BudgetConfigurationNotFoundError);
      expect(error.statusCode).toBe(STATUS_CODES.NOT_FOUND);
      expect(error.code).toBe(ERROR_CODES.BUDGET_CONFIGURATION_NOT_FOUND_ERROR);
      expect(error.name).toBe(ERROR_NAMES.BUDGET_CONFIGURATION_NOT_FOUND_ERROR);
      expect(error.message).toBe(
        `Budget Configuration doesn't belong to user nor exists`
      );
    }
  });
});
