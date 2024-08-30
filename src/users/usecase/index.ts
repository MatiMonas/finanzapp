import { User } from 'users/entity';
import { UserBuilder } from 'users/entity/userBuilder';
import { UserDirector } from 'users/entity/userDirector';
import UserRepository from 'users/repository/user-repository';
import { PostUserParams } from 'users/types';

export default class UserUseCase {
  constructor(private mysqlRepository: UserRepository) {}

  async createUser(userData: PostUserParams): Promise<User> {
    // check email user validator

    const builder = new UserBuilder();
    const director = new UserDirector(builder);
    const user = await director.buildUser(userData);

    return user;
  }

  test() {
    return 'ok';
  }
}
