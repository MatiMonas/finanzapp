import { Request } from 'express';
import { IBudgetUsecase } from '../usecase';
import { PostBudgetParams } from '../types';

export default class BudgetsHandler {
  protected budgetsUseCase: IBudgetUsecase;

  constructor(BudgetUsecase: IBudgetUsecase) {
    this.budgetsUseCase = BudgetUsecase;
  }

  createBudget = (req: Request<any, any, any, PostBudgetParams>) => {
    return this.budgetsUseCase.createBudget(req.body);
  };
}
