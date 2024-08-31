import bcrypt from 'bcrypt';
import { User } from '.';

interface IUserBuilder {
  setEmail(email: string): this;
  setPassword(password: string): Promise<this>;
  setRole(role: string): this;
  build(): User;
}

export class UserBuilder implements IUserBuilder {
  private email!: string;
  private password!: string;
  private role!: string;

  setEmail(email: string): this {
    this.email = email;
    return this;
  }

  async setPassword(password: string): Promise<this> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
    return this;
  }

  setRole(role: string): this {
    this.role = role;
    return this;
  }

  build(): User {
    return new User(this.email, this.password, this.role);
  }
}
