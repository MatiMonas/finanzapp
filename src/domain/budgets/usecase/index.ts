import Validator from 'validator';
import { IBudgetRepository } from '../repository/budget-repository';
import { CreateBudgetParams, PostBudgetParams } from '../types';
import { BudgetBuilder } from '../entity/budgetBuilder';
import { BudgetDirector } from '../entity/budgetDirector';
import { ValidatorBudgetPercentage } from '../validators/validatorBudgetPercentage';

export interface IBudgetUsecase {
  createBudget(budgetData: PostBudgetParams): Promise<Boolean>;
}

export default class BudgetUsecase implements IBudgetUsecase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async createBudget(budgetData: PostBudgetParams): Promise<boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorBudgetPercentage(),
    ]);

    const validatedBudgetData: PostBudgetParams = await modelValidator.validate(
      budgetData
    );

    const { budget_configuration_name, budgets, user_id } = validatedBudgetData;
    const budgetConfiguration =
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
        budget_configuration_id: budgetConfiguration,
      };
      const budgetPayload = director.createBudget(budgetDataForDirector);

      budgetPayloads.push(budgetPayload);
    }

    const createdBudgets = await this.budgetRepository.createBudget(
      budgetPayloads
    );

    return true;
  }
}
