import { Request } from 'express';
import { PostUserParams } from 'users/types';
import UserUsecase from 'users/usecase';

export default class UsersHandler {
  protected usersUseCase: UserUsecase;

  constructor(UsersUseCase: UserUsecase) {
    this.usersUseCase = UsersUseCase;
  }

  /* GET */
  test = (req: Request<any, any, any, any>) => {
    return this.usersUseCase.test();
  };

  create = (req: Request<any, any, any, PostUserParams>) => {
    return this.usersUseCase.create(req.body);
  };
}
