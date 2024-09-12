import Validator from 'validator';
import { PatchBudgetParams } from '../types/request';
import { IBudgetRepository } from '../repository/budget-repository';
import { BudgetPercentageError, BudgetsNotFoundError } from 'errors';

export class ValidatorBudgetPercentageCalculation extends Validator {
  protected budgetRepository: IBudgetRepository;

  constructor(BudgetRepository: IBudgetRepository) {
    super();
    this.budgetRepository = BudgetRepository;
  }

  async validate(body: PatchBudgetParams) {
    const { budgets, budget_configuration_id } = body;

    if (budgets && budgets.length > 0) {
      const existingBudgets =
        await this.budgetRepository.getBudgetsByConfigurationId(
          budget_configuration_id
        );

      if (existingBudgets.length === 0) {
        throw new BudgetsNotFoundError('No budgets found');
      }

      let totalPercentage = existingBudgets.reduce((total, budget) => {
        if (budget && budget.percentage) {
          return total + budget.percentage;
        }
        return total;
      }, 0);

      budgets.forEach((budget) => {
        if (budget.delete && budget.id) {
          const existingBudget = existingBudgets.find(
            (b) => b?.id === budget.id
          );
          if (existingBudget) {
            totalPercentage -= existingBudget.percentage;
          }
          return;
        }

        if (budget.create) {
          if (budget.percentage) {
            totalPercentage += budget.percentage;
          }
          return;
        }

        if (budget.id && budget.percentage) {
          const existingBudget = existingBudgets.find(
            (b) => b?.id === budget.id
          );
          if (existingBudget) {
            totalPercentage += budget.percentage - existingBudget.percentage;
          }
        }
      });

      if (totalPercentage !== 100) {
        throw new BudgetPercentageError(
          `The total percentage must be 100%. Current total: ${totalPercentage}%`
        );
      }
    }

    return super.validate(body);
  }
}
