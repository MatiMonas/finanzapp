import BudgetUsecase from 'components/budgets/usecase';

import { createMockFn } from './testHelpers';

export const mockBudgetUseCase = {
  getBudgetDetails: createMockFn(),
  getBudgetConfigurations: createMockFn(),
  createBudget: createMockFn(),
  partialUpdateBudgetConfiguration: createMockFn(),
  deleteBudgetConfiguration: createMockFn(),
} as unknown as BudgetUsecase;

export function createMockBudgetRepository() {
  return {
    findBudgetConfigurationWhere: createMockFn(),
    createBudgetConfiguration: createMockFn(),
    deleteBudgetConfiguration: createMockFn(),
    createBudget: createMockFn(),
    getBudgetsByConfigurationId: createMockFn(),
    updateBudgetConfigurationName: createMockFn(),
    deleteBudgets: createMockFn(),
    updateBudgets: createMockFn(),
    getBudgetDetails: createMockFn(),
    singuleUpdateBudget: createMockFn(),
  };
}
