import { PostBudgetConfigurationBody } from '../types/request';
import Validator from '../../../validator';

import { BudgetPercentageError } from 'errors';

export class ValidatorBudgetPercentage extends Validator {
  constructor() {
    super();
  }

  async validate(body: PostBudgetConfigurationBody) {
    const totalPercentageOfBudgets = body.budgets.reduce(
      (acc, budget) => acc + budget.percentage,
      0
    );

    if (totalPercentageOfBudgets != 100) {
      throw new BudgetPercentageError(
        'Budgets total sum percentage must be 100%'
      );
    }

    return super.validate(body);
  }
}
