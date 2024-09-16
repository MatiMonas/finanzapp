import BudgetRepository from 'modules/budgets/repository/budget-repository';
import BudgetUsecase from 'modules/budgets/usecase';

export const mockBudgetUseCase = {
  createBudget: jest.fn(),
  partialUpdateBudgetConfiguration: jest.fn(),
  deleteBudgetConfiguration: jest.fn(),
} as unknown as BudgetUsecase;

export const mockBudgetRepository = {
  findBudgetConfigurationWhere: jest.fn(),
  createBudgetConfiguration: jest.fn(),
  createBudget: jest.fn(),
  updateBudgetConfigurationName: jest.fn(),
  updateBudgets: jest.fn(),
  deleteBudgets: jest.fn(),
  getBudgetsByConfigurationId: jest.fn(),
  findUserBudgetConfigurationByName: jest.fn(),
} as unknown as BudgetRepository;
