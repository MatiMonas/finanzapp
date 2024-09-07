import { EmailAlreadyInUseError } from 'errors';
import Validator from 'validator';
import { IBudgetRepository } from '../repository/budget-repository';
import { PostBudgetParams } from '../types';

export class ValidateBudgetPercentage extends Validator {
  protected budgetRepository: IBudgetRepository;

  constructor(budgetRepository: IBudgetRepository) {
    super();
    this.budgetRepository = budgetRepository;
  }

  async validate(body: PostBudgetParams) {
    const data = {
      ...body,
    };

    return super.validate(data);
  }
}
