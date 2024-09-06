import { EmailAlreadyInUseError } from 'errors';
import Validator from 'validator';
import { IBudgetRepository } from '../repository/budget-repository';

type BodyValidatorEmail = {
  email: string;
};
export class ValidatorIsPercentageAvailable extends Validator {
  protected budgetRepository: IBudgetRepository;

  constructor(userRepository: IBudgetRepository) {
    super();
    this.budgetRepository = userRepository;
  }

  async validate(body: BodyValidatorEmail) {
    const data = {
      ...body,
    };

    return super.validate(data);
  }
}
