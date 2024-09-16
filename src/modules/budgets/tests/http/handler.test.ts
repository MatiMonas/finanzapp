import { mockBudgetUseCase } from '__mocks__/Budget';
import BudgetsHandler from 'modules/budgets/http/handler';
import {
  PatchBudgetBody,
  PatchBudgetParams,
  PatchBudgetPayload,
  PostBudgetConfigurationBody,
} from 'modules/budgets/types/request';
import { Request } from 'express';

const budgetsHandler = new BudgetsHandler(mockBudgetUseCase);

describe('BudgetsHandler', () => {
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
    } as unknown as Request<PatchBudgetParams, any, PatchBudgetBody>;

    await budgetsHandler.partialUpdateBudgetConfiguration(req);

    expect(
      mockBudgetUseCase.partialUpdateBudgetConfiguration
    ).toHaveBeenCalledWith(mockPatchData);
  });
});
