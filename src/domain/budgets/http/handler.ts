import { Request } from 'express';
import { IBudgetUsecase } from '../usecase';
import { PostBudgetParams } from '../types';

export default class BudgetsHandler {
  protected budgetsUseCase: IBudgetUsecase;

  constructor(BudgetUsecase: IBudgetUsecase) {
    this.budgetsUseCase = BudgetUsecase;
  }

  create = (req: Request<any, any, any, PostBudgetParams>) => {
    return this.budgetsUseCase.create(req.body);
  };
}
