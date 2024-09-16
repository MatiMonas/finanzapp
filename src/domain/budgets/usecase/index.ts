import Validator from 'validator';
import { IBudgetRepository } from '../repository/budget-repository';
import {
  CreateBudgetPayload,
  PatchBudgetBody,
  PostBudgetConfigurationBody,
} from '../types/request';
import { BudgetBuilder } from '../entity/budgetBuilder';
import { BudgetDirector } from '../entity/budgetDirector';
import { ValidatorBudgetPercentage } from '../validators/validatorBudgetPercentage';
import { ValidatorBudgetConfigurationNameInUse } from '../validators/validatorBudgetConfigurationNameInUse';
import {
  BudgetChangeValidatedData,
  ValidatorBudgetChange,
} from '../validators/validatorBudgetChange';
import { DatabaseError } from 'errors';

export interface IBudgetUsecase {
  createBudget(budgetData: PostBudgetConfigurationBody): Promise<Boolean>;
  partialUpdateBudgetConfiguration(
    budgetData: PatchBudgetBody
  ): Promise<Boolean>;
  deleteBudgetConfiguration(
    budget_configuration_id: number,
    user_id: string
  ): Promise<Boolean>;
}

export default class BudgetUsecase implements IBudgetUsecase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async createBudget(
    budgetData: PostBudgetConfigurationBody
  ): Promise<boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorBudgetConfigurationNameInUse(this.budgetRepository),
      new ValidatorBudgetPercentage(),
    ]);

    const validatedBudgetData: PostBudgetConfigurationBody =
      await modelValidator.validate(budgetData);

    const { budget_configuration_name, budgets, user_id } = validatedBudgetData;
    const budgetConfigurationId =
      await this.budgetRepository.createBudgetConfiguration(
        budget_configuration_name,
        user_id
      );

    const budgetPayloads = [];

    for (const budget of budgets) {
      const { name, percentage } = budget;
      const builder = new BudgetBuilder();
      const director = new BudgetDirector(builder);
      const budgetDataForDirector: CreateBudgetPayload = {
        user_id,
        name,
        percentage,
        budget_configuration_id: budgetConfigurationId,
      };
      const budgetPayload = director.createBudget(budgetDataForDirector);

      budgetPayloads.push(budgetPayload);
    }

    const createdBudgets = await this.budgetRepository.createBudget(
      budgetPayloads
    );

    return createdBudgets;
  }

  async partialUpdateBudgetConfiguration(
    budgetData: PatchBudgetBody
  ): Promise<boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorBudgetConfigurationNameInUse(this.budgetRepository),
      new ValidatorBudgetChange(this.budgetRepository),
    ]);

    const validatedBudgetData: BudgetChangeValidatedData =
      await modelValidator.validate(budgetData);

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
    } catch (error: any) {
      throw new DatabaseError('Unable to update budget configuration', {
        cause: error,
      });
    }
  }

  async deleteBudgetConfiguration(
    budget_configuration_id: number,
    user_id: string
  ): Promise<Boolean> {
    const modelValidator = Validator.createValidatorChain([]);

    const validatedBudgetData = await modelValidator.validate({
      budget_configuration_id,
      user_id,
    });

    return await this.budgetRepository.deleteBudgetConfiguration(
      validatedBudgetData
    );
  }
}
