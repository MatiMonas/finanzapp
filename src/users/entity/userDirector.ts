import { PostUserParams } from 'users/types';
import { User } from '.';
import { UserBuilder } from './userBuilder';

export class UserDirector {
  private builder: UserBuilder;

  constructor(builder: UserBuilder) {
    this.builder = builder;
  }

  async buildUser(userData: PostUserParams): Promise<User> {
    this.builder.setUsername(userData.username);
    this.builder.setEmail(userData.email);
    await this.builder.setPassword(userData.password);
    this.builder.setRole(userData.roles);

    return this.builder.build();
  }
}
