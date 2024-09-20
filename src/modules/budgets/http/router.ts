import { Router } from 'express';
import BudgetsHandler from './handler';
import {
  createBudgetConfigurationMiddleware,
  deleteBudgetConfigurationMiddleware,
  getBudgetConfigurationsMiddleware,
  patchBudgetConfigurationMiddleware,
} from './middlewares';
import createHandler from 'infrastructure/web/createHandler';
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
    router.get(
      '/budgets/:id',
      validateIdMiddleware,
      createHandler(this.handler.getBudget, STATUS_CODES.OK)
    );

    router.get(
      '/budget-configurations',
      getBudgetConfigurationsMiddleware,
      createHandler(this.handler.getBudgetConfigurations, STATUS_CODES.OK)
    );

    router.post(
      '/budget-configurations',
      createBudgetConfigurationMiddleware,
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

    router.delete(
      '/budget-configurations/:id',
      validateIdMiddleware,
      deleteBudgetConfigurationMiddleware,
      createHandler(
        this.handler.deleteBudgetConfiguration,
        STATUS_CODES.NO_CONTENT
      )
    );
  }

  getRouter(): Router {
    return router;
  }
}
