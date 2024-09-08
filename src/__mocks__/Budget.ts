import BudgetUsecase from 'domain/budgets/usecase';

export const mockBudgetUseCase = {
  createBudget: jest.fn(),
} as unknown as BudgetUsecase;
