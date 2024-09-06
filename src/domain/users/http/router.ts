import Handler from './handler';
import { Router } from 'express';
import createHandler from 'infrastructure/http/createHandler';
import { STATUS_CODES } from 'utils/constants';
import { createUserMiddleware } from './middlewares';
import UserUseCase from '../usecase';

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

    /* POST */
    // Not making a login yet
    router.post(
      '/users',
      createUserMiddleware,
      createHandler(this.handler.create, STATUS_CODES.CREATED)
    );
  }

  getRouter() {
    return router;
  }
}
