import Handler from './handler';
import { Router } from 'express';
import createHandler from 'infrastructure/http/createHandler';
import UserUseCase from 'users/usecase';

const router = Router();
export default class UsersRouter {
  protected userUseCase: UserUseCase;
  protected handler: Handler;

  constructor(UserUseCase: UserUseCase) {
    this.userUseCase = UserUseCase;
    this.handler = new Handler(UserUseCase);
    this.registerRouters();
  }
  registerRouters() {
    //TODO: add swagger

    /**GET */
    router.get('/users', createHandler(this.handler.test));
  }

  getRouter() {
    return router;
  }
}
