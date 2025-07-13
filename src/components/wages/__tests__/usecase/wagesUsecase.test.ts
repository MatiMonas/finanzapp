import { describe, it, expect, beforeEach } from 'bun:test';
import WagesUsecase from 'components/wages/usecase';
import {
  createMockWagesRepository,
  createMockWagesHttpRepository,
} from '__mocks__/Wages';
import { createMockBudgetRepository } from '__mocks__/Budget';
import { mockResolved, mockRejected } from '__mocks__/testHelpers';
import { DatabaseError, MissingMonthlyWageSummaryIdError } from 'errors';
import { WageBody } from 'components/wages/types';

describe('WagesUsecase', () => {
  let wagesUsecase: WagesUsecase;
  let mockWagesRepository: ReturnType<typeof createMockWagesRepository>;
  let mockWagesHttpRepository: ReturnType<typeof createMockWagesHttpRepository>;
  let mockBudgetRepository: ReturnType<typeof createMockBudgetRepository>;

  beforeEach(() => {
    mockWagesRepository = createMockWagesRepository();
    mockWagesHttpRepository = createMockWagesHttpRepository();
    mockBudgetRepository = createMockBudgetRepository();
    wagesUsecase = new WagesUsecase(
      mockWagesRepository as any,
      mockWagesHttpRepository as any,
      mockBudgetRepository as any
    );
  });

  describe('createWage', () => {
    it('OK - Creates wage successfully', async () => {
      const wageData: WageBody = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD',
      };

      // Configure specific mock results for this test
      mockWagesRepository.getMonthlyWageWhere = mockResolved(null);
      mockWagesRepository.createMonthlyWage = mockResolved({
        id: 1,
        user_id: 'user-123',
        month_and_year: '2024-12',
      } as any);
      mockWagesRepository.createWage = mockResolved({
        id: 1,
        user_id: 'user-123',
        amount: 5000,
        currency: 'USD',
        month_and_year: '2024-12',
        exchange_rate: 1.0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        monthly_wage_summary_id: 1,
        amount_in_usd: 5000,
        amount_in_ars: 5000,
      } as any);
      mockWagesHttpRepository.getBlueExchangeRate = mockResolved(1.0);
      mockBudgetRepository.findBudgetConfigurationWhere = mockResolved([
        {
          budgets: [
            { id: 1, percentage: 50, remaining_allocation: 0 },
            { id: 2, percentage: 50, remaining_allocation: 0 },
          ],
        },
      ] as any);
      mockBudgetRepository.singuleUpdateBudget = mockResolved(true);

      const result = await wagesUsecase.createWage(wageData);

      expect(result).toBe(true);
    });

    it('ERROR - Handles database error', async () => {
      const wageData: WageBody = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD',
      };

      mockWagesRepository.getMonthlyWageWhere = mockResolved(null);
      mockWagesRepository.createMonthlyWage = mockResolved({
        id: 1,
        user_id: 'user-123',
        month_and_year: '2024-12',
      } as any);
      mockWagesRepository.createWage = mockRejected(
        new DatabaseError('Database error')
      );
      mockBudgetRepository.findBudgetConfigurationWhere = mockResolved([]);

      await expect(wagesUsecase.createWage(wageData)).rejects.toThrow(
        DatabaseError
      );
    });
  });
});
