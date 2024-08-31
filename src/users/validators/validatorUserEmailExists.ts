import { UserNotFoundError } from 'errors';
import { IUserRepository } from 'users/repository/IUserRepository';
import UserRepository from 'users/repository/user-repository';
import Validator from 'validator';

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
