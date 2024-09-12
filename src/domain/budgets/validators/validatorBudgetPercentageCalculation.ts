import Validator from 'validator';
import { PatchBudgetParams } from '../types/request';
import { IBudgetRepository } from '../repository/budget-repository';
import { BudgetPercentageError } from 'errors';

export class ValidatorBudgetPercentageCalculation extends Validator {
  protected budgetRespoitory: IBudgetRepository;
  constructor(BudgetRepository: IBudgetRepository) {
    super();
    this.budgetRespoitory = BudgetRepository;
  }

  async validate(body: PatchBudgetParams) {
    /*

(alias) type PatchBudgetParams = {
    budget_configuration_id: number;
    user_id: string;
    budget_configuration_name?: string;
    budgets?: {
        id?: number;
        name?: string;
        percentage?: number;
        delete?: boolean;
        create?: boolean;
    }[];
}

*/
    const { budgets, budget_configuration_id } = body;

    if (budgets && budgets.length > 0) {
      const existingBudgets =
        await this.budgetRespoitory.getBudgetsByConfigurationId(
          budget_configuration_id
        );

      // Verificar
    }

    return super.validate(body);
  }
}
