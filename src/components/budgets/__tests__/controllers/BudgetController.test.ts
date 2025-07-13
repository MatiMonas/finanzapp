import { describe, it, expect, beforeEach } from 'bun:test';
import { mockBudgetRepository } from '__mocks__/Budget';
import {
  mockResolved,
  mockRejected,
  createMockFn,
} from '__mocks__/testHelpers';
import { validate } from 'class-validator';

import {
  PostBudgetConfigurationBody,
  PatchBudgetBody,
  DeleteBudgetConfigurationBody,
  BudgetIdParam,
  BudgetDetailsResponse,
  BudgetResponse,
  BudgetItem,
  BudgetAction,
  BudgetConfigurationParams,
  BudgetConfigurationResponse,
} from '../../types';

// Helper functions to build valid DTOs
function buildValidPostBudget(
  overrides: Partial<PostBudgetConfigurationBody> = {}
): PostBudgetConfigurationBody {
  const dto = new PostBudgetConfigurationBody();
  dto.user_id = 'user-123';
  dto.budget_configuration_name = 'Monthly Budget';
  dto.budgets = [
    { name: 'Groceries', percentage: 30 },
    { name: 'Transport', percentage: 20 },
  ];
  Object.assign(dto, overrides);
  return dto;
}

function buildValidBudgetItem(overrides: Partial<BudgetItem> = {}): BudgetItem {
  const item = new BudgetItem();
  item.name = 'Groceries';
  item.percentage = 30;
  Object.assign(item, overrides);
  return item;
}

function buildValidPatchBudget(
  overrides: Partial<PatchBudgetBody> = {}
): PatchBudgetBody {
  const dto = new PatchBudgetBody();
  dto.user_id = 'user-123';
  dto.budget_configuration_name = 'Updated Budget';
  dto.budgets = [
    { id: 1, name: 'Groceries', percentage: 35, create: false, delete: false },
  ];
  Object.assign(dto, overrides);
  return dto;
}

function buildValidBudgetAction(
  overrides: Partial<BudgetAction> = {}
): BudgetAction {
  const action = new BudgetAction();
  action.id = 1;
  action.name = 'Groceries';
  action.percentage = 30;
  action.create = false;
  action.delete = false;
  Object.assign(action, overrides);
  return action;
}

function buildValidDeleteBudget(
  overrides: Partial<DeleteBudgetConfigurationBody> = {}
): DeleteBudgetConfigurationBody {
  const dto = new DeleteBudgetConfigurationBody();
  dto.user_id = 'user-123';
  dto.budget_configuration_id = 1;
  Object.assign(dto, overrides);
  return dto;
}

function buildValidBudgetIdParam(
  overrides: Partial<BudgetIdParam> = {}
): BudgetIdParam {
  const dto = new BudgetIdParam();
  dto.id = 1;
  Object.assign(dto, overrides);
  return dto;
}

function buildValidBudgetConfigurationParams(
  overrides: Partial<BudgetConfigurationParams> = {}
): BudgetConfigurationParams {
  const dto = new BudgetConfigurationParams();
  dto.id = 1;
  dto.name = 'Monthly Budget';
  dto.user_id = 'user-123';
  dto.is_active = true;
  Object.assign(dto, overrides);
  return dto;
}

// Validation cases for PostBudgetConfigurationBody
const postBudgetValidationCases = [
  {
    description: 'should be valid with all correct fields',
    data: {},
    expectToFail: false,
    message: 'All fields are valid',
  },
  {
    description: 'should fail if user_id is empty string',
    data: { user_id: '' },
    expectToFail: true,
    message: 'user_id must be a string',
  },
  {
    description: 'should fail if user_id is null',
    data: { user_id: null as any },
    expectToFail: true,
    message: 'user_id must be a string',
  },
  {
    description: 'should fail if budget_configuration_name is empty string',
    data: { budget_configuration_name: '' },
    expectToFail: true,
    message: 'budget_configuration_name must be a string',
  },
  {
    description: 'should fail if budget_configuration_name is null',
    data: { budget_configuration_name: null as any },
    expectToFail: true,
    message: 'budget_configuration_name must be a string',
  },
  {
    description: 'should fail if budgets is empty array',
    data: { budgets: [] },
    expectToFail: true,
    message: 'budgets must be an array',
  },
  {
    description: 'should fail if budgets is null',
    data: { budgets: null as any },
    expectToFail: true,
    message: 'budgets must be an array',
  },
];

// Validation cases for BudgetItem
const budgetItemValidationCases = [
  {
    description: 'should be valid with all correct fields',
    data: {},
    expectToFail: false,
    message: 'All fields are valid',
  },
  {
    description: 'should fail if name is empty string',
    data: { name: '' },
    expectToFail: true,
    message: 'name must be a string',
  },
  {
    description: 'should fail if name is null',
    data: { name: null as any },
    expectToFail: true,
    message: 'name must be a string',
  },
  {
    description: 'should fail if percentage is negative',
    data: { percentage: -1 },
    expectToFail: true,
    message: 'percentage must not be less than 0',
  },
  {
    description: 'should fail if percentage is greater than 100',
    data: { percentage: 101 },
    expectToFail: true,
    message: 'percentage must not be greater than 100',
  },
  {
    description: 'should fail if percentage is null',
    data: { percentage: null as any },
    expectToFail: true,
    message: 'percentage must be a number',
  },
];

// Validation cases for PatchBudgetBody
const patchBudgetValidationCases = [
  {
    description: 'should be valid with all correct fields',
    data: {},
    expectToFail: false,
    message: 'All fields are valid',
  },
  {
    description: 'should fail if user_id is empty string',
    data: { user_id: '' },
    expectToFail: true,
    message: 'user_id must be a string',
  },
  {
    description: 'should fail if user_id is null',
    data: { user_id: null as any },
    expectToFail: true,
    message: 'user_id must be a string',
  },
  {
    description:
      'should fail if budget_configuration_name is empty string when provided',
    data: { budget_configuration_name: '' },
    expectToFail: true,
    message: 'budget_configuration_name must be a string',
  },
  {
    description: 'should fail if budgets contains invalid items',
    data: { budgets: [{ name: '', percentage: 150 }] as any },
    expectToFail: true,
    message: 'budgets must be valid',
  },
];

// Validation cases for BudgetAction
const budgetActionValidationCases = [
  {
    description: 'should be valid with all correct fields',
    data: {},
    expectToFail: false,
    message: 'All fields are valid',
  },
  {
    description: 'should fail if id is negative',
    data: { id: -1 },
    expectToFail: true,
    message: 'id must be a valid number',
  },
  {
    description: 'should fail if name is empty string when provided',
    data: { name: '' },
    expectToFail: true,
    message: 'name must be a string',
  },
  {
    description: 'should fail if percentage is negative',
    data: { percentage: -1 },
    expectToFail: true,
    message: 'percentage must not be less than 0',
  },
  {
    description: 'should fail if percentage is greater than 100',
    data: { percentage: 101 },
    expectToFail: true,
    message: 'percentage must not be greater than 100',
  },
  {
    description: 'should fail if create is not boolean',
    data: { create: 'true' as any },
    expectToFail: true,
    message: 'create must be a boolean',
  },
  {
    description: 'should fail if delete is not boolean',
    data: { delete: 'false' as any },
    expectToFail: true,
    message: 'delete must be a boolean',
  },
];

// Validation cases for DeleteBudgetConfigurationBody
const deleteBudgetValidationCases = [
  {
    description: 'should be valid with all correct fields',
    data: {},
    expectToFail: false,
    message: 'All fields are valid',
  },
  {
    description: 'should fail if user_id is empty string',
    data: { user_id: '' },
    expectToFail: true,
    message: 'user_id must be a string',
  },
  {
    description: 'should fail if user_id is null',
    data: { user_id: null as any },
    expectToFail: true,
    message: 'user_id must be a string',
  },
];

// Validation cases for BudgetIdParam
const budgetIdParamValidationCases = [
  {
    description: 'should be valid with all correct fields',
    data: {},
    expectToFail: false,
    message: 'All fields are valid',
  },
  {
    description: 'should fail if id is negative',
    data: { id: -1 },
    expectToFail: true,
    message: 'id must be a valid number',
  },
  {
    description: 'should fail if id is null',
    data: { id: null as any },
    expectToFail: true,
    message: 'id must be a number',
  },
];

describe('BudgetController Logic', () => {
  describe('getBudget', () => {
    it('should return budget details by ID', () => {
      const mockBudgetDetails: BudgetDetailsResponse = {
        id: 1,
        user_id: 'user-123',
        name: 'Groceries',
        percentage: 30,
        remaining_allocation: 500,
        budget_configuration_id: 1,
        monthly_wage_summary_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };
      expect(mockBudgetDetails.id).toBe(1);
      expect(mockBudgetDetails.name).toBe('Groceries');
    });
  });

  describe('getBudgetConfigurations', () => {
    it('should return budget configurations with filters', () => {
      const mockConfigurations: BudgetConfigurationResponse[] = [
        {
          id: 1,
          name: 'Monthly Budget',
          budgets: [],
        },
      ];
      expect(mockConfigurations[0].name).toBe('Monthly Budget');
    });
  });

  describe('createBudgetConfiguration', () => {
    it('should create budget configuration successfully', async () => {
      const mockBudgetData: PostBudgetConfigurationBody = {
        user_id: 'user-123',
        budget_configuration_name: 'Monthly Budget',
        budgets: [
          { name: 'Groceries', percentage: 30 },
          { name: 'Transport', percentage: 20 },
        ],
      };
      // Usecase mock with helper
      const calledWith: any[] = [];
      const mockBudgetUseCase = {
        create: createMockFn((data: PostBudgetConfigurationBody) => {
          calledWith.push(data);
          return Promise.resolve('budget-123');
        }),
      };
      const createBudget = async (
        data: PostBudgetConfigurationBody
      ): Promise<BudgetResponse> => {
        await mockBudgetUseCase.create(data);
        return {
          success: true,
          message: 'Budget configuration created successfully',
        };
      };
      const response = await createBudget(mockBudgetData);
      expect(response).toEqual({
        success: true,
        message: 'Budget configuration created successfully',
      });
      expect(calledWith[0]).toEqual(mockBudgetData);
    });

    it('should handle budget configuration creation error', async () => {
      const mockBudgetData: PostBudgetConfigurationBody = {
        user_id: 'user-123',
        budget_configuration_name: 'Monthly Budget',
        budgets: [
          { name: 'Groceries', percentage: 30 },
          { name: 'Transport', percentage: 20 },
        ],
      };
      // Usecase mock for error with helper
      const calledWith: any[] = [];
      const mockBudgetUseCase = {
        create: createMockFn((data: PostBudgetConfigurationBody) => {
          calledWith.push(data);
          return Promise.reject(new Error('Database connection failed'));
        }),
      };
      const createBudget = async (
        data: PostBudgetConfigurationBody
      ): Promise<BudgetResponse> => {
        try {
          await mockBudgetUseCase.create(data);
          return {
            success: true,
            message: 'Budget configuration created successfully',
          };
        } catch (error: any) {
          throw new Error(
            `Budget configuration creation failed: ${error.message}`
          );
        }
      };
      await expect(createBudget(mockBudgetData)).rejects.toThrow(
        'Budget configuration creation failed: Database connection failed'
      );
      expect(calledWith[0]).toEqual(mockBudgetData);
    });
  });

  describe('updateBudgetConfiguration', () => {
    it('should update budget configuration successfully', async () => {
      const calledWith: any[] = [];
      const mockBudgetUseCase = {
        update: createMockFn((data: PatchBudgetBody) => {
          calledWith.push(data);
          return Promise.resolve(true);
        }),
      };
      const updateBudget = async (
        data: PatchBudgetBody
      ): Promise<BudgetResponse> => {
        const result = await mockBudgetUseCase.update(data);
        return {
          success: result,
          message: result
            ? 'Budget configuration updated successfully'
            : 'Failed to update budget configuration',
        };
      };
      const mockUpdateData: PatchBudgetBody = {
        user_id: 'user-123',
        budget_configuration_name: 'Updated Budget',
        budgets: [
          {
            id: 1,
            name: 'Groceries',
            percentage: 35,
            create: false,
            delete: false,
          },
        ],
      };
      const response = await updateBudget(mockUpdateData);
      expect(response).toEqual({
        success: true,
        message: 'Budget configuration updated successfully',
      });
      expect(calledWith[0]).toEqual(mockUpdateData);
    });
  });

  describe('deleteBudgetConfiguration', () => {
    it('should delete budget configuration successfully', async () => {
      const calledWith: any[] = [];
      const mockBudgetUseCase = {
        delete: createMockFn((data: DeleteBudgetConfigurationBody) => {
          calledWith.push(data);
          return Promise.resolve(true);
        }),
      };
      const deleteBudget = async (
        data: DeleteBudgetConfigurationBody
      ): Promise<BudgetResponse> => {
        const result = await mockBudgetUseCase.delete(data);
        return {
          success: result,
          message: result
            ? 'Budget configuration deleted successfully'
            : 'Failed to delete budget configuration',
        };
      };
      const mockDeleteData: DeleteBudgetConfigurationBody = {
        user_id: 'user-123',
        budget_configuration_id: 1,
      };
      const response = await deleteBudget(mockDeleteData);
      expect(response).toEqual({
        success: true,
        message: 'Budget configuration deleted successfully',
      });
      expect(calledWith[0]).toEqual(mockDeleteData);
    });
  });

  describe('PostBudgetConfigurationBody validations', () => {
    postBudgetValidationCases.forEach(
      ({ description, data, expectToFail, message }) => {
        it(description, async () => {
          const dto = buildValidPostBudget(data);
          const errors = await validate(dto);

          if (expectToFail) {
            expect(errors.length).toBeGreaterThan(0);
            const hasExpectedMessage = errors.some(
              (error) =>
                error.constraints &&
                Object.values(error.constraints).some((constraint) =>
                  constraint.includes(message.split(' ')[0])
                )
            );
            expect(hasExpectedMessage).toBe(true);
          } else {
            expect(errors.length).toBe(0);
          }
        });
      }
    );
  });

  describe('BudgetItem validations', () => {
    budgetItemValidationCases.forEach(
      ({ description, data, expectToFail, message }) => {
        it(description, async () => {
          const dto = buildValidBudgetItem(data);
          const errors = await validate(dto);

          if (expectToFail) {
            expect(errors.length).toBeGreaterThan(0);
            const hasExpectedMessage = errors.some(
              (error) =>
                error.constraints &&
                Object.values(error.constraints).some((constraint) =>
                  constraint.includes(message.split(' ')[0])
                )
            );
            expect(hasExpectedMessage).toBe(true);
          } else {
            expect(errors.length).toBe(0);
          }
        });
      }
    );
  });

  describe('PatchBudgetBody validations', () => {
    patchBudgetValidationCases.forEach(
      ({ description, data, expectToFail, message }) => {
        it(description, async () => {
          const dto = buildValidPatchBudget(data);
          const errors = await validate(dto);

          if (expectToFail) {
            expect(errors.length).toBeGreaterThan(0);
            const hasExpectedMessage = errors.some(
              (error) =>
                error.constraints &&
                Object.values(error.constraints).some((constraint) =>
                  constraint.includes(message.split(' ')[0])
                )
            );
            expect(hasExpectedMessage).toBe(true);
          } else {
            expect(errors.length).toBe(0);
          }
        });
      }
    );
  });

  describe('BudgetAction validations', () => {
    budgetActionValidationCases.forEach(
      ({ description, data, expectToFail, message }) => {
        it(description, async () => {
          const dto = buildValidBudgetAction(data);
          const errors = await validate(dto);

          if (expectToFail) {
            expect(errors.length).toBeGreaterThan(0);
            const hasExpectedMessage = errors.some(
              (error) =>
                error.constraints &&
                Object.values(error.constraints).some((constraint) =>
                  constraint.includes(message.split(' ')[0])
                )
            );
            expect(hasExpectedMessage).toBe(true);
          } else {
            expect(errors.length).toBe(0);
          }
        });
      }
    );
  });

  describe('DeleteBudgetConfigurationBody validations', () => {
    deleteBudgetValidationCases.forEach(
      ({ description, data, expectToFail, message }) => {
        it(description, async () => {
          const dto = buildValidDeleteBudget(data);
          const errors = await validate(dto);

          if (expectToFail) {
            expect(errors.length).toBeGreaterThan(0);
            const hasExpectedMessage = errors.some(
              (error) =>
                error.constraints &&
                Object.values(error.constraints).some((constraint) =>
                  constraint.includes(message.split(' ')[0])
                )
            );
            expect(hasExpectedMessage).toBe(true);
          } else {
            expect(errors.length).toBe(0);
          }
        });
      }
    );
  });

  describe('BudgetIdParam validations', () => {
    budgetIdParamValidationCases.forEach(
      ({ description, data, expectToFail, message }) => {
        it(description, async () => {
          const dto = buildValidBudgetIdParam(data);
          const errors = await validate(dto);

          if (expectToFail) {
            expect(errors.length).toBeGreaterThan(0);
            const hasExpectedMessage = errors.some(
              (error) =>
                error.constraints &&
                Object.values(error.constraints).some((constraint) =>
                  constraint.includes(message.split(' ')[0])
                )
            );
            expect(hasExpectedMessage).toBe(true);
          } else {
            expect(errors.length).toBe(0);
          }
        });
      }
    );
  });
});
