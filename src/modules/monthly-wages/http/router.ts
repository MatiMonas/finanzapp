import { Router } from 'express';
import MonthlyWagesHandler, { IMonthlyWagesHandler } from './handler';
import createHandler from 'infrastructure/web/createHandler';
import { STATUS_CODES } from 'utils/constants';
import { IMonthlyWagesUsecase } from '../usecase';

const router = Router();

export interface IMonthlyWagesRouter {
  registerRouters(): void;
  getRouter(): Router;
}

export default class MonthlyWagesRouter implements IMonthlyWagesRouter {
  protected monthlyWagesUsecase: IMonthlyWagesUsecase;
  protected handler: IMonthlyWagesHandler;

  constructor(MonthlyWagesUsecase: IMonthlyWagesUsecase) {
    this.monthlyWagesUsecase = MonthlyWagesUsecase;
    this.handler = new MonthlyWagesHandler(MonthlyWagesUsecase);
    this.registerRouters();
  }

  registerRouters(): void {
    router.post(
      '/monthly-wages',
      createHandler(this.handler.createMonthlyWage, STATUS_CODES.CREATED)
    );
  }

  getRouter(): Router {
    return router;
  }
}
