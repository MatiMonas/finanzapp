import Validator from 'validator';
import { IUserRepository } from '../repository/user-repository';
import { PostUserParams } from '../types';
import { ValidatorEmailIsInUse } from '../validators/validatorEmailIsInUse';
import { UserBuilder } from '../entity/userBuilder';
import { UserDirector } from '../entity/userDirector';

export interface IUserUseCase {
  create(userData: PostUserParams): Promise<Boolean>;
  test(): string;
}

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

    return Boolean(newUser);
  }

  test() {
    return 'ok';
  }
}
