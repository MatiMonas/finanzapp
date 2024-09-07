import { Router } from 'express';
import BudgetsHandler from './handler';
import { createBudgetMiddleware } from './middlewares';
import createHandler from 'infrastructure/http/createHandler';
import { STATUS_CODES } from 'utils/constants';
import BudgetUsecase from '../usecase';

const router = Router();

export interface IBudgetRouter {
  registerRouters(): void;
  getRouter(): Router;
}

export default class BudgetRouter {
  protected budgetsUsecase: BudgetUsecase;
  protected handler: BudgetsHandler;

  constructor(BudgetsUsecase: BudgetUsecase) {
    this.budgetsUsecase = BudgetsUsecase;
    this.handler = new BudgetsHandler(BudgetsUsecase);
    this.registerRouters();
  }
  registerRouters(): void {
    //TODO: add swagger

    /* POST */

    router.post(
      '/budgets',
      createBudgetMiddleware,
      createHandler(this.handler.createBudget, STATUS_CODES.CREATED)
    );
  }

  getRouter(): Router {
    return router;
  }
}
