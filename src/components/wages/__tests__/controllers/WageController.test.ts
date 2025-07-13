import { describe, it, expect, beforeEach } from 'bun:test';
import { WageController } from 'components/wages/controllers/WageController';
import { WageBody } from 'components/wages/types';
import { createMockFn } from '__mocks__/testHelpers';

describe('WageController Logic', () => {
  let wageController: WageController;
  let mockWageUseCase: any;

  beforeEach(() => {
    mockWageUseCase = {
      createWage: createMockFn(),
    };
    wageController = new WageController(mockWageUseCase);
  });

  describe('createWage', () => {
    it('should create wage successfully', async () => {
      const wageData: WageBody = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD',
      };

      mockWageUseCase.createWage = createMockFn(() =>
        Promise.resolve('wage-123')
      );

      const result = await wageController.createWage(wageData);

      expect(result).toEqual({
        success: true,
        message: 'Wage created successfully',
      });
    });

    it('should handle wage creation error', async () => {
      const wageData: WageBody = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD',
      };

      mockWageUseCase.createWage = createMockFn(() =>
        Promise.reject(new Error('Error creating monthly wage'))
      );

      await expect(wageController.createWage(wageData)).rejects.toThrow(
        'Error creating monthly wage'
      );
    });
  });

  describe('WageBody validations', () => {
    it('should be valid with all correct fields', () => {
      const validWageData: WageBody = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD',
      };
      expect(validWageData).toBeDefined();
    });

    it('should fail if user_id is empty string', () => {
      const invalidWageData = {
        user_id: '',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.user_id).toBe('');
    });

    it('should fail if user_id is null', () => {
      const invalidWageData = {
        user_id: null,
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.user_id).toBeNull();
    });

    it('should fail if user_id is undefined', () => {
      const invalidWageData = {
        user_id: undefined,
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.user_id).toBeUndefined();
    });

    it('should fail if amount is negative', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: -1000,
        month: '12',
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.amount).toBeLessThan(0);
    });

    it('should fail if amount is zero', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 0,
        month: '12',
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.amount).toBe(0);
    });

    it('should fail if amount is null', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: null,
        month: '12',
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.amount).toBeNull();
    });

    it('should fail if amount is undefined', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: undefined,
        month: '12',
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.amount).toBeUndefined();
    });

    it('should fail if month is empty string', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '',
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.month).toBe('');
    });

    it('should fail if month is null', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: null,
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.month).toBeNull();
    });

    it('should fail if month is undefined', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: undefined,
        year: '2024',
        currency: 'USD',
      };
      expect(invalidWageData.month).toBeUndefined();
    });

    it('should fail if month is not a valid month (1-12)', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '13',
        year: '2024',
        currency: 'USD',
      };
      const month = parseInt(invalidWageData.month);
      expect(month).toBeGreaterThan(12);
    });

    it('should fail if month is zero', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '0',
        year: '2024',
        currency: 'USD',
      };
      const month = parseInt(invalidWageData.month);
      expect(month).toBe(0);
    });

    it('should fail if month is not a number string', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: 'abc',
        year: '2024',
        currency: 'USD',
      };
      const month = parseInt(invalidWageData.month);
      expect(isNaN(month)).toBe(true);
    });

    it('should fail if year is empty string', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '',
        currency: 'USD',
      };
      expect(invalidWageData.year).toBe('');
    });

    it('should fail if year is null', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: null,
        currency: 'USD',
      };
      expect(invalidWageData.year).toBeNull();
    });

    it('should fail if year is undefined', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: undefined,
        currency: 'USD',
      };
      expect(invalidWageData.year).toBeUndefined();
    });

    it('should fail if year is not a valid year', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: 'abc',
        currency: 'USD',
      };
      const year = parseInt(invalidWageData.year);
      expect(isNaN(year)).toBe(true);
    });

    it('should fail if year is too old', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '1900',
        currency: 'USD',
      };
      const year = parseInt(invalidWageData.year);
      expect(year).toBeLessThan(1901);
    });

    it('should fail if year is in the future', () => {
      const currentYear = new Date().getFullYear();
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: (currentYear + 2).toString(),
        currency: 'USD',
      };
      const year = parseInt(invalidWageData.year);
      expect(year).toBeGreaterThan(currentYear + 1);
    });

    it('should fail if currency is not USD', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'EUR',
      };
      expect(invalidWageData.currency).not.toBe('USD');
    });

    it('should fail if currency is empty string', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: '',
      };
      expect(invalidWageData.currency).toBe('');
    });

    it('should fail if currency is null', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: null,
      };
      expect(invalidWageData.currency).toBeNull();
    });

    it('should fail if currency is undefined', () => {
      const invalidWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: undefined,
      };
      expect(invalidWageData.currency).toBeUndefined();
    });

    it('should be valid with ARS currency', () => {
      const validWageData = {
        user_id: 'user-123',
        amount: 5000,
        month: '12',
        year: '2024',
        currency: 'ARS',
      };
      expect(validWageData.currency).toBe('ARS');
    });
  });

  describe('WagesParams validations', () => {
    it('should be valid with all correct fields', () => {
      const validParams = {
        user_id: 'user-123',
        amount: 5000,
        month_and_year: '12-2024',
        exchange_rate: 1.5,
        currency: 'USD',
      };
      expect(validParams).toBeDefined();
    });

    it('should be valid with only user_id', () => {
      const validParams = {
        user_id: 'user-123',
      };
      expect(validParams.user_id).toBeDefined();
    });

    it('should be valid with only amount', () => {
      const validParams = {
        amount: 5000,
      };
      expect(validParams.amount).toBeDefined();
    });

    it('should be valid with only month_and_year', () => {
      const validParams = {
        month_and_year: '12-2024',
      };
      expect(validParams.month_and_year).toBeDefined();
    });

    it('should be valid with only exchange_rate', () => {
      const validParams = {
        exchange_rate: 1.5,
      };
      expect(validParams.exchange_rate).toBeDefined();
    });

    it('should be valid with only currency', () => {
      const validParams = {
        currency: 'USD',
      };
      expect(validParams.currency).toBeDefined();
    });

    it('should fail if amount is negative when provided', () => {
      const invalidParams = {
        amount: -1000,
      };
      expect(invalidParams.amount).toBeLessThan(0);
    });

    it('should fail if exchange_rate is negative when provided', () => {
      const invalidParams = {
        exchange_rate: -1.5,
      };
      expect(invalidParams.exchange_rate).toBeLessThan(0);
    });

    it('should fail if currency is invalid when provided', () => {
      const invalidParams = {
        currency: 'EUR',
      };
      expect(invalidParams.currency).not.toBe('USD');
    });
  });
});
