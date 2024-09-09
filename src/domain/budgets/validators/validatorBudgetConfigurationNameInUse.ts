import Validator from 'validator';
import { PostBudgetParams } from '../types';
import { IBudgetRepository } from '../repository/budget-repository';
import { BudgetConfigurationNameAlreadyInUseError } from 'errors';

export class ValidatorBudgetConfigurationNameInUse extends Validator {
  protected budgetRespoitory: IBudgetRepository;
  constructor(BudgetRepository: IBudgetRepository) {
    super();
    this.budgetRespoitory = BudgetRepository;
  }

  async validate(body: PostBudgetParams) {
    const { budget_configuration_name, user_id } = body;

    const isNameUsed =
      await this.budgetRespoitory.findBudgetConfigurationByName(
        budget_configuration_name,
        user_id
      );

    if (isNameUsed) {
      throw new BudgetConfigurationNameAlreadyInUseError(
        'Budget configuration name already in use'
      );
    }

    return super.validate(body);
  }
}