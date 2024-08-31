import { EmailAlreadyInUseError } from 'errors';
import UserRepository from 'users/repository/user-repository';
import Validator from 'validator';

type BodyValidatorEmail = {
  email: string;
};

export class ValidatorEmailIsInUse extends Validator {
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

    if (user?.email === email) {
      throw new EmailAlreadyInUseError(`Email address already in use.`);
    }

    const data = {
      ...body,
      email,
    };

    return super.validate(data);
  }
}
