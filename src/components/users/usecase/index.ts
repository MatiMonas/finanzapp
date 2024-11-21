import Validator from '../../../validator';

import { IUserRepository } from '../repository/user-repository';
import { PostUserParams } from '../types';
import { ValidatorEmailIsInUse } from '../validators/validatorEmailIsInUse';
import { UserBuilder } from '../entity/userBuilder';
import { UserDirector } from '../entity/userDirector';

export interface IUserUsecase {
  create(userData: PostUserParams): Promise<string>;
  test(): string;
}

export default class UserUsecase implements IUserUsecase {
  constructor(private userRepository: IUserRepository) {}

  async create(userData: PostUserParams): Promise<string> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorEmailIsInUse(this.userRepository),
    ]);

    const validatedUserData: PostUserParams = await modelValidator.validate(
      userData
    );

    const builder = new UserBuilder();
    const director = new UserDirector(builder);
    const userPayload = await director.buildUser(validatedUserData);

    const userId = await this.userRepository.create(userPayload);

    return userId;
  }

  test() {
    return 'ok';
  }
}
