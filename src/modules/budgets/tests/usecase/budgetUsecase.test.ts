import BudgetUsecase from 'modules/budgets/usecase';
import { mockBudgetRepository } from '__mocks__/Budget';
import Validator from '../../../../validator';
import { BudgetBuilder } from 'modules/budgets/entity/budgetBuilder';
import { BudgetDirector } from 'modules/budgets/entity/budgetDirector';
import { PostBudgetConfigurationBody } from 'modules/budgets/types/request';
import { BudgetChangeValidatedData } from 'modules/budgets/validators/validatorBudgetChange';
import { DatabaseError } from 'errors';

describe('BudgetUsecase', () => {
  let budgetUsecase: BudgetUsecase;

  beforeEach(() => {
    budgetUsecase = new BudgetUsecase(mockBudgetRepository as any);
  });

  describe('createBudget', () => {
    it('OK - should return true if budgets were successfully created', async () => {
      const mockBudgetData: PostBudgetConfigurationBody = {
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
      const mockBudgetData: PostBudgetConfigurationBody = {
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

  describe('partialUpdateBudgetConfiguration', () => {
    it('OK - should return true if budget configuration is successfully updated', async () => {
      const mockBudgetData: BudgetChangeValidatedData = {
        budget_configuration_name: 'UpdatedConfigName',
        delete: [{ id: 1 }],
        create: [{ name: 'NewBudget', percentage: 20 }],
        update: [{ id: 2, name: 'UpdatedBudget', percentage: 50 }],
        budget_configuration_id: 1,
        user_id: 'user-uuid',
      };

      const mockValidatedBudgetData = {
        ...mockBudgetData,
        delete: mockBudgetData.delete,
        create: mockBudgetData.create,
        update: mockBudgetData.update,
      };

      Validator.createValidatorChain = jest.fn().mockReturnValue({
        validate: jest.fn().mockResolvedValue(mockValidatedBudgetData),
      });

      (
        mockBudgetRepository.updateBudgetConfigurationName as jest.Mock
      ).mockResolvedValue(true);
      (mockBudgetRepository.deleteBudgets as jest.Mock).mockResolvedValue(true);
      (mockBudgetRepository.createBudget as jest.Mock).mockResolvedValue(true);
      (mockBudgetRepository.updateBudgets as jest.Mock).mockResolvedValue(true);

      const result = await budgetUsecase.partialUpdateBudgetConfiguration(
        mockBudgetData
      );

      expect(result).toBe(true);
      expect(
        mockBudgetRepository.updateBudgetConfigurationName
      ).toHaveBeenCalledWith(1, 'UpdatedConfigName');
      expect(mockBudgetRepository.deleteBudgets).toHaveBeenCalledWith([1]);
      expect(mockBudgetRepository.createBudget).toHaveBeenCalledWith([
        {
          name: 'NewBudget',
          percentage: 20,
          budget_configuration_id: 1,
          user_id: 'user-uuid',
        },
      ]);
      expect(mockBudgetRepository.updateBudgets).toHaveBeenCalledWith([
        { id: 2, name: 'UpdatedBudget', percentage: 50 },
      ]);
    });

    it('Error - should throw DatabaseError if an error occurs', async () => {
      const mockBudgetData: BudgetChangeValidatedData = {
        budget_configuration_name: 'UpdatedConfigName',
        delete: [{ id: 1 }],
        create: [{ name: 'NewBudget', percentage: 20 }],
        update: [{ id: 2, name: 'UpdatedBudget', percentage: 50 }],
        budget_configuration_id: 1,
        user_id: 'user-uuid',
      };

      const mockValidatedBudgetData = {
        ...mockBudgetData,
        delete: mockBudgetData.delete,
        create: mockBudgetData.create,
        update: mockBudgetData.update,
      };

      Validator.createValidatorChain = jest.fn().mockReturnValue({
        validate: jest.fn().mockResolvedValue(mockValidatedBudgetData),
      });

      (
        mockBudgetRepository.updateBudgetConfigurationName as jest.Mock
      ).mockRejectedValue(new Error('Update failed'));

      await expect(
        budgetUsecase.partialUpdateBudgetConfiguration(mockBudgetData)
      ).rejects.toThrow(DatabaseError);
    });
  });
});
