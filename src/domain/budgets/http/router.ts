import { Router } from 'express';
import BudgetsHandler from './handler';
import {
  createBudgetMiddleware,
  patchBudgetConfigurationMiddleware,
} from './middlewares';
import createHandler from 'infrastructure/http/createHandler';
import { STATUS_CODES } from 'utils/constants';
import BudgetUsecase from '../usecase';
import { validateIdMiddleware } from 'utils/helpers/validateIdMiddleware';

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

    router.post(
      '/budgets',
      createBudgetMiddleware,
      createHandler(this.handler.createBudget, STATUS_CODES.CREATED)
    );

    router.patch(
      '/budget-configurations/:id',
      validateIdMiddleware,
      patchBudgetConfigurationMiddleware,
      createHandler(
        this.handler.partialUpdateBudgetConfiguration,
        STATUS_CODES.NO_CONTENT
      )
    );
  }

  getRouter(): Router {
    return router;
  }
}
