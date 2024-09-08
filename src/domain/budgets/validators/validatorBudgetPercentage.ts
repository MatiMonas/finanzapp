import Validator from 'validator';
import { PostBudgetParams } from '../types';
import { BudgetPercentageError } from 'errors';

export class ValidatorBudgetPercentage extends Validator {
  constructor() {
    super();
  }

  async validate(body: PostBudgetParams) {
    const totalPercentageOfBudgets = body.budgets.reduce(
      (acc, budget) => acc + budget.percentage,
      0
    );

    if (totalPercentageOfBudgets != 100) {
      throw new BudgetPercentageError('Budget total percentage must be 100%');
    }

    return super.validate(body);
  }
}
