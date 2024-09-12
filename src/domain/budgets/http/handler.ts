import { Request } from 'express';
import { IBudgetUsecase } from '../usecase';
import {
  PatchBudgetParams,
  PostBudgetConfigurationParams,
} from '../types/request';

export default class BudgetsHandler {
  protected budgetsUseCase: IBudgetUsecase;

  constructor(BudgetUsecase: IBudgetUsecase) {
    this.budgetsUseCase = BudgetUsecase;
  }

  createBudget = (
    req: Request<any, any, any, PostBudgetConfigurationParams>
  ) => {
    return this.budgetsUseCase.createBudget(req.body);
  };

  partialUpdateBudgetConfiguration = (
    req: Request<any, any, any, PatchBudgetParams>
  ) => {
    const { id: budget_configuration_id } = req.params;

    const payload = {
      budget_configuration_id,
      ...req.body,
    };

    return this.budgetsUseCase.partialUpdateBudgetConfiguration(payload);
  };
}
