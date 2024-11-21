import { Request } from 'express';
import UserUsecase from '../usecase';
import { PostUserParams } from '../types';

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
