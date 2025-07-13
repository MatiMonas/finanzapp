import { BudgetPercentageError, BudgetsNotFoundError } from 'errors';

import { BudgetAction, PatchBudgetBody } from '../types';
import Validator from '../../../validator';
import { IBudgetRepository } from '../repository/budget-repository';
import { BudgetWithoutTimestamps } from '../types';

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

  async validate(body: PatchBudgetBody) {
    const {
      budgets,
      budget_configuration_id,
      user_id,
      budget_configuration_name,
    } = body;

    if (!budget_configuration_id) {
      throw new Error('budget_configuration_id is required');
    }

    const data: BudgetChangeValidatedData = {
      budget_configuration_id,
      user_id,
      update: [],
      delete: [],
      create: [],
    };

    if (budget_configuration_name) {
      data.budget_configuration_name = budget_configuration_name;
    }

    if (budgets && budgets.length > 0) {
      const existingBudgets =
        await this.budgetRepository.getBudgetsByConfigurationId(
          budget_configuration_id
        );

      if (existingBudgets.length === 0) {
        throw new BudgetsNotFoundError('No budgets found');
      }

      const totalPercentage = existingBudgets.reduce(
        (total: number, budget: BudgetWithoutTimestamps) => {
          return budget && budget.percentage
            ? total + budget.percentage
            : total;
        },
        0
      );

      budgets.forEach((budget) => {
        if (budget.delete && budget.id) {
          this.handleDelete(budget, existingBudgets, data);
          return;
        }

        if (budget.create) {
          this.handleCreate(budget, data);
          return;
        }

        if (budget.id && (budget.percentage || budget.name)) {
          this.handleUpdate(budget, existingBudgets, data);
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
    data: BudgetChangeValidatedData
  ) {
    const existingBudget = existingBudgets.find((b) => b?.id === budget.id);
    if (existingBudget) {
      data.update.push(budget);
    }
  }

  private handleCreate(budget: BudgetAction, data: BudgetChangeValidatedData) {
    data.create.push(budget);
  }

  private handleUpdate(
    budget: BudgetAction,
    existingBudgets: BudgetWithoutTimestamps[],
    data: BudgetChangeValidatedData
  ) {
    const existingBudget = existingBudgets.find((b) => b?.id === budget.id);
    if (existingBudget) {
      data.update.push(budget);
    }
  }
}
