import { UserBuilder } from 'users/entity/userBuilder';
import { UserDirector } from 'users/entity/userDirector';
import UserRepository from 'users/repository/user-repository';
import { PostUserParams } from 'users/types';
import { ValidatorEmailIsInUse } from 'users/validators/validatorEmailIsInUse';
import Validator from 'validator';
import { IUserUseCase } from './IUserUsecase';

export default class UserUseCase implements IUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: PostUserParams): Promise<Boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorEmailIsInUse(this.userRepository),
    ]);

    const validatedUserData = await modelValidator.validate(userData);

    const builder = new UserBuilder();
    const director = new UserDirector(builder);
    const newUser = await director.buildUser(validatedUserData);

    // TODO: Pending repository execution and proper testing

    return !!newUser;
  }

  test() {
    return 'ok';
  }
}
