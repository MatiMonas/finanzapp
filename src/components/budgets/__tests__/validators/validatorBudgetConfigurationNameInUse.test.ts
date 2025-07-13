import { describe, it, expect, beforeEach } from 'bun:test';
import { ValidatorBudgetConfigurationNameInUse } from 'components/budgets/validators/validatorBudgetConfigurationNameInUse';
import { BudgetConfigurationNameAlreadyInUseError } from 'errors';
import { mockResolved } from '__mocks__/testHelpers';
import { createMockBudgetRepository } from '__mocks__/Budget';
import { PostBudgetConfigurationBody } from 'components/budgets/types';

describe('ValidatorBudgetConfigurationNameInUse', () => {
  let validator: ValidatorBudgetConfigurationNameInUse;
  let mockBudgetRepository: ReturnType<typeof createMockBudgetRepository>;

  beforeEach(() => {
    mockBudgetRepository = createMockBudgetRepository();
    validator = new ValidatorBudgetConfigurationNameInUse(mockBudgetRepository);
  });

  it('OK - Budget configuration name is not used', async () => {
    mockBudgetRepository.findBudgetConfigurationWhere = mockResolved([]);

    const body: PostBudgetConfigurationBody = {
      user_id: 'user-123',
      budget_configuration_name: 'NewConfig',
      budgets: [
        {
          name: 'Test',
          percentage: 100,
        },
      ],
    };
    const result = await validator.validate(body);

    expect(result).toEqual(body);
  });

  it('ERROR - BudgetConfigurationNameAlreadyInUseError when user wants to create new budget with existant name.', async () => {
    const budgetConfigurationResponse = [
      {
        id: 1,
        name: 'ExistingConfig',
        user_id: 'user-123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        budgets: [],
      },
    ];

    mockBudgetRepository.findBudgetConfigurationWhere = mockResolved(
      budgetConfigurationResponse as any
    );

    const body: PostBudgetConfigurationBody = {
      user_id: 'user-123',
      budget_configuration_name: 'ExistingConfig',
      budgets: [
        {
          name: 'Test',
          percentage: 100,
        },
      ],
    };

    try {
      await validator.validate(body);
      expect(true).toBe(false); // Should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(BudgetConfigurationNameAlreadyInUseError);
    }
  });
});
