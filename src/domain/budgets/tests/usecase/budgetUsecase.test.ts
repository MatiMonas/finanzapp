import BudgetUsecase from 'domain/budgets/usecase';
import { mockBudgetRepository } from '__mocks__/Budget';
import Validator from 'validator';
import { BudgetBuilder } from 'domain/budgets/entity/budgetBuilder';
import { BudgetDirector } from 'domain/budgets/entity/budgetDirector';
import { PostBudgetConfigurationParams } from 'domain/budgets/types/request';

describe('BudgetUsecase', () => {
  let budgetUsecase: BudgetUsecase;

  beforeEach(() => {
    budgetUsecase = new BudgetUsecase(mockBudgetRepository as any);
  });

  describe('createBudget', () => {
    it('OK - should return true if budgets were successfully created', async () => {
      const mockBudgetData: PostBudgetConfigurationParams = {
        user_id: 'user-uuid',
        budget_configuration_name: 'Basico',
        budgets: [
          { name: 'Ahorro', percentage: 30 },
          { name: 'Vivienda', percentage: 60 },
          { name: 'Goce', percentage: 10 },
        ],
      };

      const mockValidatedBudgetData = { ...mockBudgetData };

      Validator.createValidatorChain = jest.fn().mockReturnValue({
        validate: jest.fn().mockResolvedValue(mockValidatedBudgetData),
      });

      const mockBuilder = new BudgetBuilder();
      const mockDirector = new BudgetDirector(mockBuilder);

      mockDirector.createBudget = jest.fn().mockReturnValue({
        user_id: 'user-uuid',
        name: 'Ahorro',
        percentage: 30,
        budget_configuration_id: 1,
      });

      (
        mockBudgetRepository.createBudgetConfiguration as jest.Mock
      ).mockResolvedValue(1);

      (mockBudgetRepository.createBudget as jest.Mock).mockResolvedValue(true);

      const result = await budgetUsecase.createBudget(mockBudgetData);

      expect(result).toBe(true);
      expect(
        mockBudgetRepository.createBudgetConfiguration
      ).toHaveBeenCalledWith('Basico', 'user-uuid');
      expect(mockBudgetRepository.createBudget).toHaveBeenCalledWith([
        {
          user_id: 'user-uuid',
          name: 'Ahorro',
          percentage: 30,
          budget_configuration_id: 1,
        },
        {
          user_id: 'user-uuid',
          name: 'Vivienda',
          percentage: 60,
          budget_configuration_id: 1,
        },
        {
          user_id: 'user-uuid',
          name: 'Goce',
          percentage: 10,
          budget_configuration_id: 1,
        },
      ]);
    });

    it('OK - should return false if budgets were not created', async () => {
      const mockBudgetData: PostBudgetConfigurationParams = {
        user_id: 'user-uuid',
        budget_configuration_name: 'Basico',
        budgets: [
          { name: 'Ahorro', percentage: 30 },
          { name: 'Vivienda', percentage: 60 },
          { name: 'Goce', percentage: 10 },
        ],
      };

      const mockValidatedBudgetData = { ...mockBudgetData };

      Validator.createValidatorChain = jest.fn().mockReturnValue({
        validate: jest.fn().mockResolvedValue(mockValidatedBudgetData),
      });

      const mockBuilder = new BudgetBuilder();
      const mockDirector = new BudgetDirector(mockBuilder);

      mockDirector.createBudget = jest.fn().mockReturnValue({
        user_id: 'user-uuid',
        name: 'Ahorro',
        percentage: 30,
        budget_configuration_id: 1,
      });

      (
        mockBudgetRepository.createBudgetConfiguration as jest.Mock
      ).mockResolvedValue(1);

      (mockBudgetRepository.createBudget as jest.Mock).mockResolvedValue(false);

      const result = await budgetUsecase.createBudget(mockBudgetData);

      expect(result).toBe(false);
    });
  });
});
