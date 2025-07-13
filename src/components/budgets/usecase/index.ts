import { Budgets } from '@prisma/client';
import { handlePrismaError } from 'utils/helpers/prismaErrorHandler';

import Validator from '../../../validator';
import {
  BudgetConfigurationParams,
  PostBudgetConfigurationBody,
  PatchBudgetBody,
  CreateBudgetPayload,
  DeleteBudgetConfigurationPayload,
  BudgetConfigurationResponse,
} from '../types';
import { BudgetDirector } from '../entity/budgetDirector';
import { ValidatorBudgetPercentage } from '../validators/validatorBudgetPercentage';
import { ValidatorBudgetConfigurationNameInUse } from '../validators/validatorBudgetConfigurationNameInUse';
import {
  BudgetChangeValidatedData,
  ValidatorBudgetChange,
} from '../validators/validatorBudgetChange';
import { ValidatorIsBudgetConfigurationFromUser } from '../validators/validatorIsBudgetConfigurationFromUser';
import { IBudgetRepository } from '../repository/budget-repository';

export interface IBudgetUsecase {
  getBudgetConfigurations(
    filterData: BudgetConfigurationParams
  ): Promise<BudgetConfigurationResponse[]>;
  createBudget(budgetData: PostBudgetConfigurationBody): Promise<boolean>;
  partialUpdateBudgetConfiguration(
    budgetData: PatchBudgetBody
  ): Promise<boolean>;
  deleteBudgetConfiguration(
    budgetToDelete: DeleteBudgetConfigurationPayload
  ): Promise<boolean>;

  getBudgetDetails(budgetId: number): Promise<Budgets | null>;
}

export default class BudgetUsecase implements IBudgetUsecase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async getBudgetConfigurations(
    filterData: BudgetConfigurationParams
  ): Promise<BudgetConfigurationResponse[]> {
    const budgetConfigurations =
      await this.budgetRepository.findBudgetConfigurationWhere(filterData);

    return budgetConfigurations.map((config) => ({
      id: config.id,
      name: config.name,
      budgets: config.budgets.map((budget) => ({
        id: budget.id,
        name: budget.name,
        percentage: budget.percentage,
        remaining_allocation: budget.remaining_allocation,
        monthly_wage_summary_id: budget.monthly_wage_summary_id,
      })),
    }));
  }

  async createBudget(
    budgetData: PostBudgetConfigurationBody
  ): Promise<boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorBudgetConfigurationNameInUse(this.budgetRepository),
      new ValidatorBudgetPercentage(),
    ]);

    const validatedBudgetData = (await modelValidator.validate(
      budgetData
    )) as PostBudgetConfigurationBody;

    const { budget_configuration_name, budgets, user_id } = validatedBudgetData;
    const budgetConfigurationId =
      await this.budgetRepository.createBudgetConfiguration(
        budget_configuration_name,
        user_id
      );

    const budgetPayloads = [];

    for (const budget of budgets) {
      const { name, percentage } = budget;
      const director = new BudgetDirector();
      const budgetDataForDirector: CreateBudgetPayload = {
        user_id,
        name,
        percentage,
        budget_configuration_id: budgetConfigurationId,
      };
      const budgetPayload = director.createBudget(budgetDataForDirector);

      budgetPayloads.push(budgetPayload);
    }

    const createdBudgets =
      await this.budgetRepository.createBudget(budgetPayloads);

    return createdBudgets;
  }

  async partialUpdateBudgetConfiguration(
    budgetData: PatchBudgetBody
  ): Promise<boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorBudgetConfigurationNameInUse(this.budgetRepository),
      new ValidatorBudgetChange(this.budgetRepository),
    ]);

    const validatedBudgetData = (await modelValidator.validate(
      budgetData
    )) as BudgetChangeValidatedData;

    try {
      // 1. Update configuration name
      if (validatedBudgetData.budget_configuration_name) {
        await this.budgetRepository.updateBudgetConfigurationName(
          validatedBudgetData.budget_configuration_id,
          validatedBudgetData.budget_configuration_name
        );
      }

      // 2. Delete budgets
      if (validatedBudgetData.delete.length > 0) {
        const idsToDelete = validatedBudgetData.delete
          .map((budget) => budget.id)
          .filter((id): id is number => id !== undefined);
        await this.budgetRepository.deleteBudgets(idsToDelete);
      }

      // 3. Create budgets
      if (validatedBudgetData.create.length > 0) {
        const budgetsToCreate = validatedBudgetData.create
          .map((budget) => ({
            name: budget.name || '',
            percentage: budget.percentage || 0,
            budget_configuration_id:
              validatedBudgetData.budget_configuration_id,
            user_id: validatedBudgetData.user_id,
          }))
          .filter((budget) => budget.name !== '' && budget.percentage !== 0);
        await this.budgetRepository.createBudget(budgetsToCreate);
      }

      // 4. Update budgets
      if (validatedBudgetData.update.length > 0) {
        await this.budgetRepository.updateBudgets(validatedBudgetData.update);
      }

      return true;
    } catch (error: unknown) {
      handlePrismaError(error, 'Unable to update budget configuration');
      return false; // This line will never be reached due to handlePrismaError throwing
    }
  }

  async deleteBudgetConfiguration(
    budgetToDelete: DeleteBudgetConfigurationPayload
  ): Promise<boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorIsBudgetConfigurationFromUser(this.budgetRepository),
    ]);

    const { budget_configuration_id, user_id } = budgetToDelete;

    const validatedBudgetData = (await modelValidator.validate({
      budget_configuration_id,
      user_id,
    })) as DeleteBudgetConfigurationPayload;

    return await this.budgetRepository.deleteBudgetConfiguration(
      validatedBudgetData
    );
  }

  async getBudgetDetails(budgetId: number): Promise<Budgets | null> {
    return await this.budgetRepository.getBudgetDetails(budgetId);
  }
}
