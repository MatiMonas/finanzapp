import { Request } from 'express';
import { IBudgetUsecase } from '../usecase';
import {
  DeleteBudgetConfigurationBody,
  DeleteBudgetConfigurationParams,
  PatchBudgetBody,
  PatchBudgetParams,
  PostBudgetConfigurationBody,
} from '../types/request';

export default class BudgetsHandler {
  protected budgetsUseCase: IBudgetUsecase;

  constructor(BudgetUsecase: IBudgetUsecase) {
    this.budgetsUseCase = BudgetUsecase;
  }

  createBudget = (req: Request<any, any, PostBudgetConfigurationBody>) => {
    return this.budgetsUseCase.createBudget(req.body);
  };

  partialUpdateBudgetConfiguration = (
    req: Request<PatchBudgetParams, any, PatchBudgetBody>
  ) => {
    const { id: budget_configuration_id } = req.params;

    const payload = {
      budget_configuration_id,
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

    return this.budgetsUseCase.deleteBudgetConfiguration(
      budget_configuration_id,
      user_id
    );
  };
}
