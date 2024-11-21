import jwt from 'jsonwebtoken';
import env from 'utils/env';
import { verifyPassword } from '../utils/functions';
const { JWT_SECRET_KEY } = env;
interface IUser {
  isPasswordValid(enteredPassword: string): Promise<boolean>;
  generateToken(): string;
}
export class User implements IUser {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly roles: number[]
  ) {}

  async isPasswordValid(enteredPassword: string): Promise<boolean> {
    return await verifyPassword(enteredPassword, this.password);
  }

  generateToken(): string {
    const payload = {
      username: this.username,
      email: this.email,
      roles: this.roles,
    };

    const options = {
      expiresIn: '1h',
    };

    return jwt.sign(payload, JWT_SECRET_KEY as string, options);
  }
}
