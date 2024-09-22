import { Router } from 'express';
import MonthlyWagesUsecase, { IMonthlyWagesUsecase } from '../usecase';
import MonthlyWagesHandler, { IMonthlyWagesHandler } from './handler';
import createHandler from 'infrastructure/web/createHandler';
import { STATUS_CODES } from 'utils/constants';

const router = Router();

export interface IMonthlyWagesRouter {
  registerRouters(): void;
  getRouter(): Router;
}

export default class MonthlyWagesRouter {
  protected budgetsUsecase: IMonthlyWagesUsecase;
  protected handler: IMonthlyWagesHandler;

  constructor(BudgetsUsecase: IMonthlyWagesUsecase) {
    this.budgetsUsecase = BudgetsUsecase;
    this.handler = new MonthlyWagesHandler(BudgetsUsecase);
    this.registerRouters();
  }

  registerRouters(): void {
    router.post(
      '/monthly-wages',
      createHandler(this.handler.create, STATUS_CODES.CREATED)
    );
  }

  getRouter(): Router {
    return router;
  }
}
