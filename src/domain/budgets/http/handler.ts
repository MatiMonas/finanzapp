import { Request } from 'express';
import { IBudgetUsecase } from '../usecase';

export default class BudgetsHandler {
  protected budgetsUseCase: IBudgetUsecase;

  constructor(BudgetUsecase: IBudgetUsecase) {
    this.budgetsUseCase = BudgetUsecase;
  }

  create = (req: Request<any, any, any, any>) => {
    return this.budgetsUseCase.create(req.body);
  };
}
