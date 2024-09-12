import Validator from 'validator';
import { IBudgetRepository } from '../repository/budget-repository';
import {
  CreateBudgetParams,
  PatchBudgetParams,
  PostBudgetConfigurationParams,
} from '../types/request';
import { BudgetBuilder } from '../entity/budgetBuilder';
import { BudgetDirector } from '../entity/budgetDirector';
import { ValidatorBudgetPercentage } from '../validators/validatorBudgetPercentage';
import { ValidatorBudgetConfigurationNameInUse } from '../validators/validatorBudgetConfigurationNameInUse';
import { ValidatorBudgetPercentageCalculation } from '../validators/validatorBudgetPercentageCalculation';

export interface IBudgetUsecase {
  createBudget(budgetData: PostBudgetConfigurationParams): Promise<Boolean>;
  partialUpdateBudgetConfiguration(
    budgetData: PatchBudgetParams
  ): Promise<Boolean>;
}

export default class BudgetUsecase implements IBudgetUsecase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async createBudget(
    budgetData: PostBudgetConfigurationParams
  ): Promise<boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorBudgetConfigurationNameInUse(this.budgetRepository),
      new ValidatorBudgetPercentage(),
    ]);

    const validatedBudgetData: PostBudgetConfigurationParams =
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
      const budgetDataForDirector: CreateBudgetParams = {
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
    budgetData: PatchBudgetParams
  ): Promise<Boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorBudgetConfigurationNameInUse(this.budgetRepository),
      new ValidatorBudgetPercentageCalculation(this.budgetRepository),
    ]);

    const validatedBudgetData: PatchBudgetParams =
      await modelValidator.validate(budgetData);

    return true;
  }
}
