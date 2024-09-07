import { UserNotFoundError } from 'errors';
import Validator from 'validator';
import { IUserRepository } from '../repository/user-repository';

type BodyValidatorEmail = {
  email: string;
};

export class ValidatorUserEmailExists extends Validator {
  protected userRepository: IUserRepository;
  /**
   *
   * @param {import('../repository/user-repository.ts')} userRepository
   */
  constructor(userRepository: IUserRepository) {
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
