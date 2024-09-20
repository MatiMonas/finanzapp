import { mockBudgetUseCase } from '__mocks__/Budget';
import BudgetsHandler from 'modules/budgets/http/handler';
import {
  PatchBudgetBody,
  BudgetIdParam,
  PatchBudgetPayload,
  PostBudgetConfigurationBody,
  BudgetConfigurationParams,
  DeleteBudgetConfigurationBody,
  DeleteBudgetConfigurationParams,
} from 'modules/budgets/types/request';
import { Request } from 'express';

const budgetsHandler = new BudgetsHandler(mockBudgetUseCase);

describe('BudgetsHandler', () => {
  it('should call getBudget method of BudgetUseCase with correct data', async () => {
    const mockBudgetId: BudgetIdParam = {
      id: 6,
    };

    const req = {
      params: mockBudgetId,
    } as Request<any, any, any, any>;

    const mockBudgetData = {
      id: 6,
      user_id: 'c270dfc2-ac37-46b1-83ad-c3450d15425e',
      name: 'Test2',
      percentage: 40,
      remaining_allocation: 0,
      budget_configuration_id: 3,
      monthly_wage_id: null,
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
      monthly_wage: null,
    };
    (mockBudgetUseCase.getBudgetDetails as jest.Mock).mockResolvedValue([
      mockBudgetData,
    ]);

    await budgetsHandler.getBudget(req);

    expect(mockBudgetUseCase.getBudgetDetails).toHaveBeenCalledWith(6);

    expect(req).toEqual({
      params: {
        id: 6,
      },
    });
  });

  it('should call getBudgetConfigurations method of BudgetUseCase with correct data', async () => {
    const mockFilterData: BudgetConfigurationParams = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Basic Configuration',
    };
    (mockBudgetUseCase.getBudgetConfigurations as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: 'Basic Configuration',
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        created_at: '2024-09-20T02:46:36.551Z',
        updated_at: '2024-09-20T02:48:11.015Z',
        deleted_at: null,
      },
    ]);
    const req = {
      query: mockFilterData,
    } as Request<any, any, BudgetConfigurationParams, any>;

    await budgetsHandler.getBudgetConfigurations(req);
    expect(mockBudgetUseCase.getBudgetConfigurations).toHaveBeenCalledWith(
      mockFilterData
    );
  });

  it('should call createBudget method of BudgetUseCase with correct data', async () => {
    const mockBudgetData: PostBudgetConfigurationBody = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      budget_configuration_name: 'Basic Configuration',
      budgets: [
        { name: 'Savings', percentage: 30 },
        { name: 'Housing', percentage: 60 },
        { name: 'Entertainment', percentage: 10 },
      ],
    };

    (mockBudgetUseCase.createBudget as jest.Mock).mockResolvedValue(true);

    const req = {
      body: mockBudgetData,
    } as Request<any, any, PostBudgetConfigurationBody>;

    await budgetsHandler.createBudget(req);

    expect(mockBudgetUseCase.createBudget).toHaveBeenCalledWith(mockBudgetData);
  });

  it('should call partialUpdateBudgetConfiguration method of BudgetUseCase with correct data', async () => {
    const mockPatchData: PatchBudgetPayload = {
      budget_configuration_id: 1,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      budget_configuration_name: 'Updated Configuration',
      budgets: [
        { id: 1, name: 'Savings', percentage: 40 },
        { id: 2, name: 'Housing', percentage: 50 },
        { id: 3, name: 'Entertainment', percentage: 10 },
      ],
    };

    (
      mockBudgetUseCase.partialUpdateBudgetConfiguration as jest.Mock
    ).mockResolvedValue(true);

    const req = {
      body: mockPatchData,
      params: {
        budget_configuration_id: 1,
      },
    } as unknown as Request<BudgetIdParam, any, PatchBudgetBody>;

    await budgetsHandler.partialUpdateBudgetConfiguration(req);

    expect(
      mockBudgetUseCase.partialUpdateBudgetConfiguration
    ).toHaveBeenCalledWith(mockPatchData);
  });

  it('should call deleteBudgetConfiguration method of BudgetUseCase with correct data', async () => {
    const req = {
      params: {
        id: '1',
      },
      body: {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
      },
    } as unknown as Request<
      DeleteBudgetConfigurationParams,
      any,
      DeleteBudgetConfigurationBody
    >;

    (
      mockBudgetUseCase.deleteBudgetConfiguration as jest.Mock
    ).mockResolvedValue(true);

    await budgetsHandler.deleteBudgetConfiguration(req);
    expect(mockBudgetUseCase.deleteBudgetConfiguration).toHaveBeenCalledWith({
      budget_configuration_id: 1,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    });
  });
});
