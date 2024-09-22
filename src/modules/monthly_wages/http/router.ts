import { Router } from 'express';
import MonthlyWagesUsecase from '../usecase';
import MonthlyWagesHandler, { IMonthlyWagesHandler } from './handler';

const router = Router();

export interface IMonthlyWagesRouter {
  registerRouters(): void;
  getRouter(): Router;
}

export default class MonthlyWagesRouter {
  protected budgetsUsecase: MonthlyWagesUsecase;
  protected handler: IMonthlyWagesHandler;

  constructor(BudgetsUsecase: MonthlyWagesUsecase) {
    this.budgetsUsecase = BudgetsUsecase;
    this.handler = new MonthlyWagesHandler(BudgetsUsecase);
    this.registerRouters();
  }

  registerRouters(): void {}

  getRouter(): Router {
    return router;
  }
}
