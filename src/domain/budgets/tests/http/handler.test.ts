import BudgetsHandler from 'domain/budgets/http/handler';
import { PostBudgetParams } from 'domain/budgets/types';
import { IBudgetUsecase } from 'domain/budgets/usecase';
import { Request } from 'express';

const mockBudgetUseCase = {
  createBudget: jest.fn(),
} as unknown as IBudgetUsecase;

const budgetsHandler = new BudgetsHandler(mockBudgetUseCase);

describe('BudgetsHandler', () => {
  it('should call createBudget method of BudgetUseCase with correct data', async () => {
    const mockBudgetData: PostBudgetParams = {
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
    } as Request<any, any, any, PostBudgetParams>;

    await budgetsHandler.createBudget(req);

    expect(mockBudgetUseCase.createBudget).toHaveBeenCalledWith(mockBudgetData);
  });
});
