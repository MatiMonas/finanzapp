import bcrypt from 'bcrypt';
import { User } from '.';

interface UserBuilderInterface {
  setEmail(email: string): Promise<this>;
  setPassword(password: string): Promise<this>;
  setRole(role: string): Promise<this>;
  build(): Promise<User>;
}

export class UserBuilder implements UserBuilderInterface {
  private email!: string;
  private password!: string;
  private role!: string;

  async setEmail(email: string): Promise<this> {
    this.email = email;
    return this;
  }

  async setPassword(password: string): Promise<this> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
    return this;
  }

  async setRole(role: string): Promise<this> {
    this.role = role;
    return this;
  }

  async build(): Promise<User> {
    return new User(this.email, this.password, this.role);
  }
}
