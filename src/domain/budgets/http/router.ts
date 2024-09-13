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

/**
 * @swagger
 * tags:
 *   - name: Budgets
 *     description: Operations related to budgets and budget configurations
 */

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
    /**
     * @swagger
     * /budgets:
     *   post:
     *     tags:
     *       - Budgets
     *     summary: Create a new budget configuration
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: string
     *               budget_configuration_name:
     *                 type: string
     *               budgets:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     name:
     *                       type: string
     *                     percentage:
     *                       type: number
     *     responses:
     *       201:
     *         description: Budget configuration created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: boolean
     *               example: true
     *       400:
     *         description: Bad request, invalid input
     *       500:
     *         description: Internal server error
     */

    router.post(
      '/budgets',
      createBudgetMiddleware,
      createHandler(this.handler.createBudget, STATUS_CODES.CREATED)
    );

    /**
     * @swagger
     * /budget-configurations/{id}:
     *   patch:
     *     tags:
     *       - Budgets
     *     summary: Partially update a budget configuration
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of the budget configuration to update
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               budget_configuration_id:
     *                 type: integer
     *               user_id:
     *                 type: string
     *               budget_configuration_name:
     *                 type: string
     *               budgets:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     name:
     *                       type: string
     *                     percentage:
     *                       type: number
     *     responses:
     *       204:
     *         description: Budget configuration updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: boolean
     *               example: true
     *       400:
     *         description: Bad request, invalid input
     *       404:
     *         description: Budget configuration not found
     *       500:
     *         description: Internal server error
     */

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
