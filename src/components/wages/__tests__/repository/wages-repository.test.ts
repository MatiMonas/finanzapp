import { describe, it, expect, beforeEach } from 'bun:test';
import WagesRepository from 'components/wages/repository/wages_repository';
import { DatabaseError } from 'errors';
import { createMockFn } from '__mocks__/testHelpers';

// Helper function to create test data
const createTestWage = (overrides: any = {}) => ({
  user_id: 'user-123',
  amount: 5000,
  currency: 'USD',
  exchange_rate: 1.0,
  amount_in_usd: 5000,
  amount_in_ars: 5000,
  month_and_year: '2024-12',
  monthly_wage_summary_id: 1,
  ...overrides,
});

describe('WagesRepository', () => {
  let wagesRepository: WagesRepository;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      wages: {
        create: createMockFn(),
        findFirst: createMockFn(),
      },
      monthlyWageSummary: {
        create: createMockFn(),
        findFirst: createMockFn(),
        update: createMockFn(),
      },
    };
    wagesRepository = new WagesRepository(mockPrisma);
  });

  describe('createWage', () => {
    it('OK - Creates wage successfully', async () => {
      const wageData = createTestWage();
      const createdWage = { ...wageData, id: 1 };

      mockPrisma.wages.create = createMockFn(() =>
        Promise.resolve(createdWage)
      );

      const result = await wagesRepository.createWage(wageData);

      expect(result).toEqual(createdWage);
    });

    it('ERROR - Handles Prisma client error', async () => {
      const wageData = createTestWage();
      const error = new Error('Database connection failed');

      mockPrisma.wages.create = createMockFn(() => Promise.reject(error));

      await expect(wagesRepository.createWage(wageData)).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe('getMonthlyWageWhere', () => {
    it('OK - Returns monthly wage when exists', async () => {
      const where = { user_id: 'user-123', month_and_year: '2024-12' };
      const existingWage = {
        id: 1,
        user_id: 'user-123',
        month_and_year: '2024-12',
        total_wage: 5000,
        remaining: 5000,
      };

      mockPrisma.monthlyWageSummary.findFirst = createMockFn(() =>
        Promise.resolve(existingWage)
      );

      const result = await wagesRepository.getMonthlyWageWhere(where);

      expect(result).toEqual(existingWage);
    });

    it('OK - Returns null when monthly wage does not exist', async () => {
      const where = { user_id: 'user-123', month_and_year: '2024-12' };

      mockPrisma.monthlyWageSummary.findFirst = createMockFn(() =>
        Promise.resolve(null)
      );

      const result = await wagesRepository.getMonthlyWageWhere(where);

      expect(result).toBeNull();
    });

    it('ERROR - Handles Prisma client error', async () => {
      const where = { user_id: 'user-123', month_and_year: '2024-12' };
      const error = new Error('Database connection failed');

      mockPrisma.monthlyWageSummary.findFirst = createMockFn(() =>
        Promise.reject(error)
      );

      await expect(wagesRepository.getMonthlyWageWhere(where)).rejects.toThrow(
        DatabaseError
      );
    });
  });
});
