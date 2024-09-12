import { mockBudgetUseCase } from '__mocks__/Budget';
import BudgetsHandler from 'domain/budgets/http/handler';
import {
  PatchBudgetParams,
  PostBudgetConfigurationParams,
} from 'domain/budgets/types/request';
import { Request } from 'express';

const budgetsHandler = new BudgetsHandler(mockBudgetUseCase);

describe('BudgetsHandler', () => {
  it('should call createBudget method of BudgetUseCase with correct data', async () => {
    const mockBudgetData: PostBudgetConfigurationParams = {
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
    } as Request<any, any, any, PostBudgetConfigurationParams>;

    await budgetsHandler.createBudget(req);

    expect(mockBudgetUseCase.createBudget).toHaveBeenCalledWith(mockBudgetData);
  });

  it('should call partialUpdateBudgetConfiguration method of BudgetUseCase with correct data', async () => {
    const mockPatchData: PatchBudgetParams = {
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
        id: 1,
      },
    } as Request<any, any, any, PatchBudgetParams>;

    await budgetsHandler.partialUpdateBudgetConfiguration(req);

    expect(
      mockBudgetUseCase.partialUpdateBudgetConfiguration
    ).toHaveBeenCalledWith(mockPatchData);
  });
});
