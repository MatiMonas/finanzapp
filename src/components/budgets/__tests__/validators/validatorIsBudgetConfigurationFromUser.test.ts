import { describe, it, expect, beforeEach } from 'bun:test';
import { ValidatorIsBudgetConfigurationFromUser } from 'components/budgets/validators/validatorIsBudgetConfigurationFromUser';
import { BudgetConfigurationNotFoundError } from 'errors';
import { mockResolved } from '__mocks__/testHelpers';
import { createMockBudgetRepository } from '__mocks__/Budget';

describe('ValidatorIsBudgetConfigurationFromUser', () => {
  let validator: ValidatorIsBudgetConfigurationFromUser;
  let mockBudgetRepository: ReturnType<typeof createMockBudgetRepository>;

  beforeEach(() => {
    mockBudgetRepository = createMockBudgetRepository();
    validator = new ValidatorIsBudgetConfigurationFromUser(
      mockBudgetRepository
    );
  });

  it('OK - Budget Configuration belongs to user', async () => {
    mockBudgetRepository.findBudgetConfigurationWhere = mockResolved([
      {
        id: 1,
        name: 'TestConfig',
        user_id: 'user-123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        budgets: [],
      },
    ] as any);

    const body = {
      budget_configuration_id: 1,
      user_id: 'user-123',
    };

    const result = await validator.validate(body);

    expect(result).toEqual(body);
  });

  it('ERROR - Budget Configuration does not belong to user', async () => {
    mockBudgetRepository.findBudgetConfigurationWhere = mockResolved([]);

    const body = {
      budget_configuration_id: 1,
      user_id: 'user-123',
    };

    try {
      await validator.validate(body);
      expect(true).toBe(false); // Should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(BudgetConfigurationNotFoundError);
    }
  });
});
