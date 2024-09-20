import BudgetRepository from 'modules/budgets/repository/budget-repository';
import BudgetUsecase from 'modules/budgets/usecase';

export const mockBudgetUseCase = {
  getBudgetDetails: jest.fn(),
  getBudgetConfigurations: jest.fn(),
  createBudget: jest.fn(),
  partialUpdateBudgetConfiguration: jest.fn(),
  deleteBudgetConfiguration: jest.fn(),
} as unknown as BudgetUsecase;

export const mockBudgetRepository = {
  findBudgetConfigurationWhere: jest.fn(),
  createBudgetConfiguration: jest.fn(),
  deleteBudgetConfiguration: jest.fn(),
  createBudget: jest.fn(),
  updateBudgetConfigurationName: jest.fn(),
  updateBudgets: jest.fn(),
  deleteBudgets: jest.fn(),
  getBudgetsByConfigurationId: jest.fn(),
  getBudgetDetails: jest.fn(),
} as unknown as BudgetRepository;
