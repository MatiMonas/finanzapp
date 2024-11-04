import BudgetUsecase from 'components/budgets/usecase';
import { mockBudgetRepository } from '__mocks__/Budget';
import Validator from '../../../../validator';
import { BudgetBuilder } from 'components/budgets/entity/budgetBuilder';
import { BudgetDirector } from 'components/budgets/entity/budgetDirector';
import { PostBudgetConfigurationBody } from 'components/budgets/types/request';
import { BudgetChangeValidatedData } from 'components/budgets/validators/validatorBudgetChange';
import { DatabaseError } from 'errors';
import { ValidatorIsBudgetConfigurationFromUser } from 'components/budgets/validators/validatorIsBudgetConfigurationFromUser';

describe('BudgetUsecase', () => {
  let budgetUsecase: BudgetUsecase;

  beforeEach(() => {
    budgetUsecase = new BudgetUsecase(mockBudgetRepository as any);
  });

  describe('getBudgetConfigurations', () => {
    it('OK - Should return budget configurations', async () => {
      const mockResult = [
        {
          id: 1,
          name: 'Basic Configuration',
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          created_at: '2024-01-01',
          updated_at: '2024-01-02',
          deleted_at: null,
          budgets: [
            {
              name: 'Savings',
              percentage: 30,
            },
          ],
        },
      ];
      (
        mockBudgetRepository.findBudgetConfigurationWhere as jest.Mock
      ).mockResolvedValue(mockResult);

      const result = await budgetUsecase.getBudgetConfigurations({});

      expect(result).toBe(mockResult);
    });
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

  describe('deleteBudgetConfiguration', () => {
    it('OK - should return true if the budget configuration is successfully deleted', async () => {
      const budgetToDelete = {
        budget_configuration_id: 1,
        user_id: 'user-uuid',
      };

      const validatedBudgetData = { ...budgetToDelete };

      Validator.createValidatorChain = jest.fn().mockReturnValue({
        validate: jest.fn().mockResolvedValue(validatedBudgetData),
      });

      (
        mockBudgetRepository.deleteBudgetConfiguration as jest.Mock
      ).mockResolvedValue(true);

      const result = await budgetUsecase.deleteBudgetConfiguration(
        budgetToDelete
      );

      expect(result).toBe(true);
      expect(Validator.createValidatorChain).toHaveBeenCalledWith([
        expect.any(ValidatorIsBudgetConfigurationFromUser),
      ]);
      expect(
        mockBudgetRepository.deleteBudgetConfiguration
      ).toHaveBeenCalledWith(validatedBudgetData);
    });

    it('ERROR - should throw an error if validations fails', async () => {});
  });

  describe('getBudgetDetails', () => {
    it('OK - should return budget details', async () => {
      const budgetDetails = {
        id: 6,
        user_id: 'c270dfc2-ac37-46b1-83ad-c3450d15425e',
        name: 'Test2',
        percentage: 40,
        remaining_allocation: 0,
        budget_configuration_id: 3,
        wage_id: null,
        created_at: '2024-09-20T02:47:06.154Z',
        updated_at: '2024-09-20T02:48:11.015Z',
        deleted_at: null,
        alerts: [],
        budget_configuration: {
          id: 3,
          name: 'Test 1',
          user_id: 'c270dfc2-ac37-46b1-83ad-c3450d15425e',
          created_at: '2024-09-20T02:46:36.551Z',
          updated_at: '2024-09-20T02:48:11.015Z',
          deleted_at: null,
        },
        wage: null,
      };

      (mockBudgetRepository.getBudgetDetails as jest.Mock).mockResolvedValue(
        budgetDetails
      );

      const result = await budgetUsecase.getBudgetDetails(6);

      expect(result).toEqual(budgetDetails);

      expect(mockBudgetRepository.getBudgetDetails).toHaveBeenCalledWith(6);
    });

    it('OK - Should return null if budget not found', async () => {
      (mockBudgetRepository.getBudgetDetails as jest.Mock).mockResolvedValue(
        null
      );

      const result = await budgetUsecase.getBudgetDetails(6);

      expect(result).toBe(null);
      expect(mockBudgetRepository.getBudgetDetails).toHaveBeenCalledWith(6);
    });
  });
});
