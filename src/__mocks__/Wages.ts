import WagesUsecase from 'components/wages/usecase';

import { createMockFn } from './testHelpers';

export const mockWagesUseCase = {
  createWage: createMockFn(),
} as unknown as WagesUsecase;

export function createMockWagesRepository() {
  return {
    getMonthlyWageWhere: createMockFn(),
    createMonthlyWage: createMockFn(),
    createWage: createMockFn(),
    updateMonthlyWageSummary: createMockFn(),
  };
}

export function createMockWagesHttpRepository() {
  return {
    getBlueExchangeRate: createMockFn(),
  };
}
