import Validator from 'validator';
import { IBudgetRepository } from '../repository/budget-repository';
import { PostBudgetParams } from '../types';
import { BudgetBuilder } from '../entity/budgetBuilder';
import { BudgetDirector } from '../entity/budgetDirector';
import { ValidateBudgetPercentage } from '../validators/validatorBudgetPercentage';

export interface IBudgetUsecase {
  createBudget(budgetData: PostBudgetParams): Promise<Boolean>;
}

export default class BudgetUsecase implements IBudgetUsecase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async createBudget(budgetData: PostBudgetParams): Promise<boolean> {
    // Primero se debe crear el budegets_configuration
    const budgetConfiguration =
      await this.budgetRepository.createBudgetConfiguration(
        budgetData.budget_configuration_name,
        budgetData.user_id
      );

    return true;
  }
}
