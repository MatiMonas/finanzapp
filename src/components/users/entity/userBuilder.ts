import bcrypt from 'bcrypt';

import { User } from '.';

interface IUserBuilder {
  setUsername(username: string): this;
  setEmail(email: string): this;
  setPassword(password: string): Promise<this>;
  setRole(role: number[]): this;
  build(): User;
}

export class UserBuilder implements IUserBuilder {
  private username!: string;
  private email!: string;
  private password!: string;
  private roles!: number[];

  setUsername(username: string): this {
    this.username = username;
    return this;
  }

  setEmail(email: string): this {
    this.email = email;
    return this;
  }

  async setPassword(password: string): Promise<this> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
    return this;
  }

  setRole(role: number[]): this {
    this.roles = role;
    return this;
  }

  build(): User {
    return new User(this.username, this.email, this.password, this.roles);
  }
}
