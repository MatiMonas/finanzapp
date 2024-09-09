import BudgetRepository from 'domain/budgets/repository/budget-repository';
import BudgetUsecase from 'domain/budgets/usecase';

export const mockBudgetUseCase = {
  createBudget: jest.fn(),
} as unknown as BudgetUsecase;

export const mockBudgetRepository = {
  createBudgetConfiguration: jest.fn(),
  createBudget: jest.fn(),
  getBudgetsByConfigurationId: jest.fn(),
  findBudgetConfigurationByName: jest.fn(),
} as unknown as BudgetRepository;
