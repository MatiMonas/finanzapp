import { describe, it, expect, beforeEach } from 'bun:test';
import { ValidatorMonthlyWageExists } from 'components/wages/validators/validatorMonthlyWageExists';
import { IWagesRepository } from 'components/wages/repository/wages_repository';
import { createMockFn } from '__mocks__/testHelpers';

describe('ValidatorMonthlyWageExists', () => {
  let validator: ValidatorMonthlyWageExists;
  let mockWagesRepository: IWagesRepository;

  beforeEach(() => {
    mockWagesRepository = {
      getMonthlyWageWhere: createMockFn(),
    } as IWagesRepository;
    validator = new ValidatorMonthlyWageExists(mockWagesRepository);
  });

  describe('validate', () => {
    it('OK - Should return modified body when monthly wage does not exist', async () => {
      mockWagesRepository.getMonthlyWageWhere = createMockFn(() =>
        Promise.resolve(null)
      );

      const body = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD' as const,
      };

      const result = await validator.validate(body);

      expect(result).toEqual({
        ...body,
        month_and_year: '2024-12',
        monthly_wage_summary_id: null,
      });
    });

    it('OK - Should return modified body when monthly wage exists', async () => {
      const existingWage = {
        id: 1,
        user_id: 'user-123',
        month_and_year: '2024-12',
        total_wage: 5000,
        remaining: 5000,
      };

      mockWagesRepository.getMonthlyWageWhere = createMockFn(() =>
        Promise.resolve(existingWage)
      );

      const body = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD' as const,
      };

      const result = await validator.validate(body);

      expect(result).toEqual({
        ...body,
        month_and_year: '2024-12',
        monthly_wage_summary_id: 1,
      });
    });

    it('OK - Should handle different month formats correctly', async () => {
      mockWagesRepository.getMonthlyWageWhere = createMockFn(() =>
        Promise.resolve(null)
      );

      const body = {
        user_id: 'user-123',
        amount: 5000,
        month: '1',
        year: '2024',
        currency: 'USD' as const,
      };

      const result = await validator.validate(body);

      expect(result).toEqual({
        ...body,
        month_and_year: '2024-01',
        monthly_wage_summary_id: null,
      });
    });

    it('OK - Should handle single digit months correctly', async () => {
      mockWagesRepository.getMonthlyWageWhere = createMockFn(() =>
        Promise.resolve(null)
      );

      const body = {
        user_id: 'user-123',
        amount: 5000,
        month: '3',
        year: '2024',
        currency: 'USD' as const,
      };

      const result = await validator.validate(body);

      expect(result).toEqual({
        ...body,
        month_and_year: '2024-03',
        monthly_wage_summary_id: null,
      });
    });

    it('OK - Should preserve original body properties', async () => {
      mockWagesRepository.getMonthlyWageWhere = createMockFn(() =>
        Promise.resolve(null)
      );

      const body = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD' as const,
        additional_property: 'test',
      };

      const result = await validator.validate(body);

      expect(result).toEqual({
        ...body,
        month_and_year: '2024-12',
        monthly_wage_summary_id: null,
      });
    });

    it('OK - Should handle existing monthly wage with additional properties', async () => {
      const existingWage = {
        id: 1,
        user_id: 'user-123',
        month_and_year: '2024-12',
        total_wage: 5000,
        remaining: 5000,
      };

      mockWagesRepository.getMonthlyWageWhere = createMockFn(() =>
        Promise.resolve(existingWage)
      );

      const body = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD' as const,
        extra_field: 'value',
      };

      const result = await validator.validate(body);

      expect(result).toEqual({
        ...body,
        month_and_year: '2024-12',
        monthly_wage_summary_id: 1,
      });
    });
  });
});
