import { EmailAlreadyInUseError } from 'errors';
import Validator from 'validator';
import { IUserRepository } from '../repository/user-repository';

type BodyValidatorEmail = {
  email: string;
};
export class ValidatorEmailIsInUse extends Validator {
  protected userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
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
