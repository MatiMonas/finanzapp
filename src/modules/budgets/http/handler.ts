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

export default class BudgetsHandler {
  protected budgetsUseCase: IBudgetUsecase;

  constructor(BudgetUsecase: IBudgetUsecase) {
    this.budgetsUseCase = BudgetUsecase;
  }

  getBudget = (req: Request<BudgetIdParam, any, any, any>) => {
    const { id: budget_id } = req.params;
    return this.budgetsUseCase.getBudgetDetails(Number(budget_id));
  };

  getBudgetConfigurations = (
    req: Request<any, any, BudgetConfigurationParams, any>
  ) => {
    // TODO: add user-id or session from headers instead of query
    return this.budgetsUseCase.getBudgetConfigurations(req.query);
  };

  createBudget = (req: Request<any, any, PostBudgetConfigurationBody>) => {
    return this.budgetsUseCase.createBudget(req.body);
  };

  partialUpdateBudgetConfiguration = (
    req: Request<BudgetIdParam, any, PatchBudgetBody>
  ) => {
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
  ) => {
    const { id: budget_configuration_id } = req.params;
    const { user_id } = req.body;

    const budgetToDelete: DeleteBudgetConfigurationPayload = {
      budget_configuration_id: Number(budget_configuration_id),
      user_id,
    };

    return this.budgetsUseCase.deleteBudgetConfiguration(budgetToDelete);
  };
}
