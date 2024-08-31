import { UserNotFoundError } from 'errors';
import UserRepository from 'users/repository/user-repository';
import Validator from 'validator';

type BodyValidatorEmail = {
  email: string;
};

export class ValidatorUserEmailExists extends Validator {
  protected userRepository;
  /**
   *
   * @param {import('../repository/user-repository.ts')} userRepository
   */
  constructor(userRepository: UserRepository) {
    super();
    this.userRepository = userRepository;
  }

  async validate(body: BodyValidatorEmail) {
    const { email } = body;
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new UserNotFoundError(`User with email "${email}" not found.`);
    }

    return super.validate(body);
  }
}
