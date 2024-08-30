// entity/UserDirector.ts

import { PostUserParams } from 'users/types';
import { UserBuilder } from './userBuilder';
import { User } from '.';

export class UserDirector {
  private builder: UserBuilder;

  constructor(builder: UserBuilder) {
    this.builder = builder;
  }

  async buildUser(userData: PostUserParams): Promise<User> {
    await this.builder.setEmail(userData.email);
    await this.builder.setPassword(userData.password);
    await this.builder.setRole(userData.role);

    return this.builder.build();
  }
}
