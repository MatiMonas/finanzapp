import { Request } from 'express';
import UserUseCase from 'users/usecase';

export default class UsersHandler {
  protected usersUseCase: UserUseCase;

  constructor(UsersUseCase: UserUseCase) {
    this.usersUseCase = UsersUseCase;
  }

  /* GET */
  test = (req: Request<any, any, any, any>) => {
    return this.usersUseCase.test();
  };
}
