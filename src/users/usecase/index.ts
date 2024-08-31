import { UserBuilder } from 'users/entity/userBuilder';
import { UserDirector } from 'users/entity/userDirector';
import UserRepository from 'users/repository/user-repository';
import { PostUserParams } from 'users/types';
import { ValidatorEmailIsInUse } from 'users/validators/validatorEmailIsInUse';
import Validator from 'validator';
import { IUserUseCase } from './IUserUsecase';
import { IUserRepository } from 'users/repository/IUserRepository';

export default class UserUseCase implements IUserUseCase {
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

    return !!newUser;
  }

  test() {
    return 'ok';
  }
}
