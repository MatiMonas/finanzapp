import BudgetUsecase from 'budgets/usecase';
import { Router } from 'express';
import BudgetsHandler from './handler';
import { createBudgetMiddleware } from './middlewares';
import createHandler from 'infrastructure/http/createHandler';
import { STATUS_CODES } from 'utils/constants';

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
    // Not making a login yet
    router.post(
      '/users',
      createBudgetMiddleware,
      createHandler(this.handler.create, STATUS_CODES.CREATED)
    );
  }

  getRouter(): Router {
    return router;
  }
}
