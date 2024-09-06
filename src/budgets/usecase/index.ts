import Validator from 'validator';
import { IBudgetRepository } from 'budgets/repository/budget-repository';

export interface IBudgetUsecase {
  create(budgetData: any): Promise<Boolean>;
}

export default class BudgetUsecase implements IBudgetUsecase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async create(budgetData: any): Promise<any> {}
}
