import { BudgetConfigurationNameAlreadyInUseError } from 'errors';

import { PostBudgetConfigurationBody } from '../types';
import Validator from '../../../validator';
import { IBudgetRepository } from '../repository/budget-repository';

export class ValidatorBudgetConfigurationNameInUse extends Validator {
  protected budgetRespoitory: IBudgetRepository;
  constructor(BudgetRepository: IBudgetRepository) {
    super();
    this.budgetRespoitory = BudgetRepository;
  }

  async validate(body: PostBudgetConfigurationBody) {
    const { budget_configuration_name, user_id } = body;

    const [foundConfiguration] =
      await this.budgetRespoitory.findBudgetConfigurationWhere({
        name: budget_configuration_name,
        user_id,
      });

    if (foundConfiguration?.name) {
      throw new BudgetConfigurationNameAlreadyInUseError(
        'Budget configuration name already in use'
      );
    }

    return super.validate(body);
  }
}
