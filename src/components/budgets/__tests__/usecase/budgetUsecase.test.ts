import { describe, it, expect, beforeEach } from 'bun:test';
import BudgetUsecase from 'components/budgets/usecase';
import { createMockBudgetRepository } from '__mocks__/Budget';
import { BudgetBuilder } from 'components/budgets/entity/budgetBuilder';
import { BudgetDirector } from 'components/budgets/entity/budgetDirector';
import {
  PostBudgetConfigurationBody,
  PatchBudgetBody,
  DeleteBudgetConfigurationBody,
} from 'components/budgets/types/request';
import { BudgetChangeValidatedData } from 'components/budgets/validators/validatorBudgetChange';
import { DatabaseError } from 'errors';
import { ValidatorIsBudgetConfigurationFromUser } from 'components/budgets/validators/validatorIsBudgetConfigurationFromUser';
import {
  mockResolved,
  mockRejected,
  createMockValidator,
} from '__mocks__/testHelpers';

import Validator from '../../../../validator';

describe('BudgetUsecase', () => {
  let budgetUsecase: BudgetUsecase;
  let mockBudgetRepository: ReturnType<typeof createMockBudgetRepository>;

  beforeEach(() => {
    mockBudgetRepository = createMockBudgetRepository();
    budgetUsecase = new BudgetUsecase(mockBudgetRepository);
  });

  it('getBudgetConfigurations - should return budget configurations', async () => {
    // Mock repository method
    mockBudgetRepository.findBudgetConfigurationWhere = mockResolved([
      {
        id: 1,
        name: 'Basic Configuration',
        is_public: undefined,
        created_at: '2024-01-01',
        updated_at: '2024-01-02',
        budgets: [
          {
            id: undefined,
            name: 'Savings',
            percentage: 30,
            remaining_allocation: undefined,
            monthly_wage_summary_id: undefined,
            created_at: undefined,
            updated_at: undefined,
          },
        ],
      },
    ] as any);

    const result = await budgetUsecase.getBudgetConfigurations({});
    expect(result).toEqual([
      {
        id: 1,
        name: 'Basic Configuration',
        budgets: [
          {
            id: undefined,
            name: 'Savings',
            percentage: 30,
            remaining_allocation: undefined,
            monthly_wage_summary_id: undefined,
          },
        ],
      },
    ]);
  });

  it('createBudget - should return true if budgets were successfully created', async () => {
    const mockBudgetData: PostBudgetConfigurationBody = {
      user_id: 'user-uuid',
      budget_configuration_name: 'Basico',
      budgets: [
        { name: 'Ahorro', percentage: 30 },
        { name: 'Vivienda', percentage: 60 },
        { name: 'Goce', percentage: 10 },
      ],
    };
    const mockValidatedBudgetData = {
      ...mockBudgetData,
    } as PostBudgetConfigurationBody;
    // Mock validator
    Validator.createValidatorChain = createMockValidator(
      mockValidatedBudgetData
    );
    // Mock repository methods
    mockBudgetRepository.createBudgetConfiguration = mockResolved(1);
    mockBudgetRepository.createBudget = mockResolved(true);
    const result = await budgetUsecase.createBudget(mockBudgetData);
    expect(result).toBe(true);
  });

  it('createBudget - should return false if budgets were not created', async () => {
    const mockBudgetData: PostBudgetConfigurationBody = {
      user_id: 'user-uuid',
      budget_configuration_name: 'Basico',
      budgets: [
        { name: 'Ahorro', percentage: 30 },
        { name: 'Vivienda', percentage: 60 },
        { name: 'Goce', percentage: 10 },
      ],
    };
    const mockValidatedBudgetData = {
      ...mockBudgetData,
    } as PostBudgetConfigurationBody;
    // Mock validator
    Validator.createValidatorChain = createMockValidator(
      mockValidatedBudgetData
    );
    // Mock repository methods
    mockBudgetRepository.createBudgetConfiguration = mockResolved(1);
    mockBudgetRepository.createBudget = mockResolved(false);
    const result = await budgetUsecase.createBudget(mockBudgetData);
    expect(result).toBe(false);
  });

  it('partialUpdateBudgetConfiguration - should return true if budget configuration is successfully updated', async () => {
    const mockBudgetData: BudgetChangeValidatedData = {
      budget_configuration_name: 'UpdatedConfigName',
      delete: [{ id: 1 }],
      create: [{ name: 'NewBudget', percentage: 20 }],
      update: [{ id: 2, name: 'UpdatedBudget', percentage: 50 }],
      budget_configuration_id: 1,
      user_id: 'user-uuid',
    };
    const mockValidatedBudgetData = {
      ...mockBudgetData,
      delete: mockBudgetData.delete,
      create: mockBudgetData.create,
      update: mockBudgetData.update,
    } as BudgetChangeValidatedData;
    // Mock validator
    Validator.createValidatorChain = createMockValidator(
      mockValidatedBudgetData
    );
    // Mock repository methods
    mockBudgetRepository.updateBudgetConfigurationName = mockResolved(true);
    mockBudgetRepository.deleteBudgets = mockResolved(true);
    mockBudgetRepository.createBudget = mockResolved(true);
    mockBudgetRepository.updateBudgets = mockResolved(true);
    const result =
      await budgetUsecase.partialUpdateBudgetConfiguration(mockBudgetData);
    expect(result).toBe(true);
  });

  it('partialUpdateBudgetConfiguration - should throw DatabaseError if an error occurs', async () => {
    const mockBudgetData: BudgetChangeValidatedData = {
      budget_configuration_name: 'UpdatedConfigName',
      delete: [{ id: 1 }],
      create: [{ name: 'NewBudget', percentage: 20 }],
      update: [{ id: 2, name: 'UpdatedBudget', percentage: 50 }],
      budget_configuration_id: 1,
      user_id: 'user-uuid',
    };
    const mockValidatedBudgetData = {
      ...mockBudgetData,
      delete: mockBudgetData.delete,
      create: mockBudgetData.create,
      update: mockBudgetData.update,
    } as BudgetChangeValidatedData;
    // Mock validator
    Validator.createValidatorChain = createMockValidator(
      mockValidatedBudgetData
    );
    // Mock repository method to throw error
    mockBudgetRepository.updateBudgetConfigurationName = mockRejected(
      new Error('Update failed')
    );
    try {
      await budgetUsecase.partialUpdateBudgetConfiguration(mockBudgetData);
    } catch (error) {
      expect(error).toBeInstanceOf(DatabaseError);
    }
  });

  it('deleteBudgetConfiguration - should return true if the budget configuration is successfully deleted', async () => {
    const budgetToDelete = {
      budget_configuration_id: 1,
      user_id: 'user-uuid',
    };
    const validatedBudgetData = {
      ...budgetToDelete,
    } as DeleteBudgetConfigurationBody;
    // Mock validator
    Validator.createValidatorChain = createMockValidator(validatedBudgetData);
    // Mock repository method
    mockBudgetRepository.deleteBudgetConfiguration = mockResolved(true);
    const result =
      await budgetUsecase.deleteBudgetConfiguration(budgetToDelete);
    expect(result).toBe(true);
  });

  it('getBudgetDetails - should return budget details', async () => {
    const budgetDetails = {
      id: 6,
      user_id: 'c270dfc2-ac37-46b1-83ad-c3450d15425e',
      name: 'Test2',
      percentage: 40,
      remaining_allocation: 0,
      budget_configuration_id: 3,
      wage_id: null,
      created_at: '2024-09-20T02:47:06.154Z',
      updated_at: '2024-09-20T02:48:11.015Z',
      deleted_at: null,
      alerts: [],
      budget_configuration: {
        id: 3,
        name: 'Test 1',
        user_id: 'c270dfc2-ac37-46b1-83ad-c3450d15425e',
        created_at: '2024-09-20T02:46:36.551Z',
        updated_at: '2024-09-20T02:48:11.015Z',
        deleted_at: null,
      },
      wage: null,
    };
    // Mock repository method
    mockBudgetRepository.getBudgetDetails = mockResolved(budgetDetails as any);
    const result = await budgetUsecase.getBudgetDetails(6);
    expect(result).toEqual(budgetDetails);
  });

  it('getBudgetDetails - should return null if budget not found', async () => {
    // Mock repository method to return null
    mockBudgetRepository.getBudgetDetails = mockResolved(null);
    const result = await budgetUsecase.getBudgetDetails(6);
    expect(result).toBe(null);
  });
});
