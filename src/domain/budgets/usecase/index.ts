import Validator from 'validator';
import { IBudgetRepository } from '../repository/budget-repository';
import { PostBudgetParams } from '../types';
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

    await this.budgetRepository.createBudgetConfiguration(
      validatedBudgetData.budget_configuration_name,
      validatedBudgetData.user_id
    );

    for (const budget of validatedBudgetData.budgets) {
    }

    return true;
  }
}
