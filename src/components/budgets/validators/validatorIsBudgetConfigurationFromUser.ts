import { BudgetConfigurationNotFoundError } from 'errors';

import Validator from '../../../validator';
import { DeleteBudgetConfigurationPayload } from '../types';
import { IBudgetRepository } from '../repository/budget-repository';

export class ValidatorIsBudgetConfigurationFromUser extends Validator {
  protected budgetRespoitory: IBudgetRepository;

  constructor(BudgetRepository: IBudgetRepository) {
    super();
    this.budgetRespoitory = BudgetRepository;
  }

  async validate(body: DeleteBudgetConfigurationPayload) {
    const { budget_configuration_id, user_id } = body;

    const isBudgetFromUser =
      await this.budgetRespoitory.findBudgetConfigurationWhere({
        user_id,
        id: budget_configuration_id,
      });

    if (isBudgetFromUser.length === 0) {
      throw new BudgetConfigurationNotFoundError(
        `Budget Configuration doesn't belong to user nor exists`
      );
    }

    return super.validate(body);
  }
}
