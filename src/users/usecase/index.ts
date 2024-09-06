import { UserDirector } from 'users/entity/userDirector';
import { UserBuilder } from 'users/entity/userBuilder';
import { IUserRepository } from 'users/repository/user-repository';
import { PostUserParams } from 'users/types';
import { ValidatorEmailIsInUse } from 'users/validators/validatorEmailIsInUse';
import Validator from 'validator';

export interface IUserUsecase {
  create(userData: PostUserParams): Promise<Boolean>;
  test(): string;
}

export default class UserUsecase implements IUserUsecase {
  constructor(private userRepository: IUserRepository) {}

  async create(userData: PostUserParams): Promise<Boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorEmailIsInUse(this.userRepository),
    ]);

    const validatedUserData = await modelValidator.validate(userData);

    const builder = new UserBuilder();
    const director = new UserDirector(builder);
    const userPayload = await director.buildUser(validatedUserData);

    const newUser = await this.userRepository.create(userPayload);

    return Boolean(newUser);
  }

  test() {
    return 'ok';
  }
}
