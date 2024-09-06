import { IBudgetUsecase } from 'budgets/usecase';
import { Request } from 'express';
import { PostUserParams } from 'users/types';

export default class BudgetsHandler {
  protected budgetsUseCase: IBudgetUsecase;

  constructor(BudgetUsecase: IBudgetUsecase) {
    this.budgetsUseCase = BudgetUsecase;
  }

  create = (req: Request<any, any, any, any>) => {
    return this.budgetsUseCase.create(req.body);
  };
}
