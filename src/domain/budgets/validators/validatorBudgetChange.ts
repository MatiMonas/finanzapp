import { BudgetAction, PatchBudgetParams } from '../types/request';
import { IBudgetRepository } from '../repository/budget-repository';
import {
  BadRequestError,
  BudgetPercentageError,
  BudgetsNotFoundError,
} from 'errors';
import Validator from '../../../validator';

import { BudgetWithoutTimestamps } from '../types/db_model';

export type BudgetChangeValidatedData = {
  budget_configuration_id: number;
  budget_configuration_name?: string;
  user_id: string;
  update: BudgetAction[];
  delete: BudgetAction[];
  create: BudgetAction[];
};

export class ValidatorBudgetChange extends Validator {
  protected budgetRepository: IBudgetRepository;

  constructor(BudgetRepository: IBudgetRepository) {
    super();
    this.budgetRepository = BudgetRepository;
  }

  async validate(body: PatchBudgetParams) {
    const {
      budgets,
      budget_configuration_id,
      user_id,
      budget_configuration_name,
    } = body;

    const data: BudgetChangeValidatedData = {
      budget_configuration_id,
      user_id,
      update: [],
      delete: [],
      create: [],
    };

    budget_configuration_name &&
      (data.budget_configuration_name = budget_configuration_name);

    if (budgets && budgets.length > 0) {
      const existingBudgets =
        await this.budgetRepository.getBudgetsByConfigurationId(
          budget_configuration_id
        );

      if (existingBudgets.length === 0) {
        throw new BudgetsNotFoundError('No budgets found');
      }

      let totalPercentage = existingBudgets.reduce((total, budget) => {
        return budget && budget.percentage ? total + budget.percentage : total;
      }, 0);

      budgets.forEach((budget) => {
        if (budget.delete && budget.id) {
          this.handleDelete(budget, existingBudgets, data, totalPercentage);
          return;
        }

        if (budget.create) {
          this.handleCreate(budget, data, totalPercentage);
          return;
        }

        if (budget.id && (budget.percentage || budget.name)) {
          this.handleUpdate(budget, existingBudgets, data, totalPercentage);
        }
      });

      if (totalPercentage !== 100) {
        throw new BudgetPercentageError(
          `The total percentage must be 100%. Current total: ${totalPercentage}%`
        );
      }
    }

    return super.validate(data);
  }

  private handleDelete(
    budget: BudgetAction,
    existingBudgets: BudgetWithoutTimestamps[],
    data: BudgetChangeValidatedData,
    totalPercentage: number
  ) {
    const existingBudget = existingBudgets.find((b) => b?.id === budget.id);
    if (existingBudget) {
      totalPercentage -= existingBudget.percentage!;
      data.update.push(budget);
    }
  }

  private handleCreate(
    budget: BudgetAction,
    data: BudgetChangeValidatedData,
    totalPercentage: number
  ) {
    if (budget.percentage) {
      totalPercentage += budget.percentage;
    }
    data.create.push(budget);
  }

  private handleUpdate(
    budget: BudgetAction,
    existingBudgets: BudgetWithoutTimestamps[],
    data: BudgetChangeValidatedData,
    totalPercentage: number
  ) {
    const existingBudget = existingBudgets.find((b) => b?.id === budget.id);
    if (existingBudget) {
      totalPercentage += budget.percentage! - existingBudget.percentage!;
    }
    data.update.push(budget);
  }
}
