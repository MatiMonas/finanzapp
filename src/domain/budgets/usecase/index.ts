import Validator from 'validator';
import { IBudgetRepository } from '../repository/budget-repository';
import { PostBudgetParams } from '../types';

export interface IBudgetUsecase {
  create(budgetData: PostBudgetParams): Promise<Boolean>;
}

export default class BudgetUsecase implements IBudgetUsecase {
  constructor(private budgetRepository: IBudgetRepository) {}

  async create(budgetData: PostBudgetParams): Promise<any> {}
}
