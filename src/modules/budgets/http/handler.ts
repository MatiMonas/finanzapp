import { Request } from 'express';
import { IBudgetUsecase } from '../usecase';
import {
  BudgetConfigurationParams,
  DeleteBudgetConfigurationBody,
  DeleteBudgetConfigurationParams,
  DeleteBudgetConfigurationPayload,
  PatchBudgetBody,
  BudgetIdParam,
  PostBudgetConfigurationBody,
} from '../types/request';
import { Budgets } from '@prisma/client';
import { BudgetConfigurationWithBudgets } from '../types/db_model';

export interface IBudgetsHandler {
  getBudget: (
    req: Request<BudgetIdParam, any, any, any>
  ) => Promise<Budgets | null>;
  getBudgetConfigurations: (
    req: Request<any, any, BudgetConfigurationParams, any>
  ) => Promise<BudgetConfigurationWithBudgets[]>;
  createBudget: (
    req: Request<any, any, PostBudgetConfigurationBody>
  ) => Promise<Boolean>;
  partialUpdateBudgetConfiguration: (
    req: Request<BudgetIdParam, any, PatchBudgetBody>
  ) => Promise<Boolean>;
  deleteBudgetConfiguration: (
    req: Request<
      DeleteBudgetConfigurationParams,
      any,
      DeleteBudgetConfigurationBody
    >
  ) => Promise<Boolean>;
}
export default class BudgetsHandler {
  constructor(private budgetsUseCase: IBudgetUsecase) {}

  getBudget = (
    req: Request<BudgetIdParam, any, any, any>
  ): Promise<Budgets | null> => {
    const { id: budget_id } = req.params;
    return this.budgetsUseCase.getBudgetDetails(Number(budget_id));
  };

  getBudgetConfigurations = (
    req: Request<any, any, BudgetConfigurationParams, any>
  ): Promise<BudgetConfigurationWithBudgets[]> => {
    // TODO: add user-id or session from headers instead of query
    return this.budgetsUseCase.getBudgetConfigurations(req.query);
  };

  createBudget = (
    req: Request<any, any, PostBudgetConfigurationBody>
  ): Promise<Boolean> => {
    return this.budgetsUseCase.createBudget(req.body);
  };

  partialUpdateBudgetConfiguration = (
    req: Request<BudgetIdParam, any, PatchBudgetBody>
  ): Promise<Boolean> => {
    const { id: budget_configuration_id } = req.params;

    const payload = {
      budget_configuration_id: Number(budget_configuration_id),
      ...req.body,
    };

    return this.budgetsUseCase.partialUpdateBudgetConfiguration(payload);
  };

  deleteBudgetConfiguration = (
    req: Request<
      DeleteBudgetConfigurationParams,
      any,
      DeleteBudgetConfigurationBody
    >
  ): Promise<Boolean> => {
    const { id: budget_configuration_id } = req.params;
    const { user_id } = req.body;

    const budgetToDelete: DeleteBudgetConfigurationPayload = {
      budget_configuration_id: Number(budget_configuration_id),
      user_id,
    };

    return this.budgetsUseCase.deleteBudgetConfiguration(budgetToDelete);
  };
}
