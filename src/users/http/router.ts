import Handler from './handler';
import { Router } from 'express';
import createHandler from 'infrastructure/http/createHandler';
import UserUsecase from 'users/usecase';
import { STATUS_CODES } from 'utils/constants';
import { createUserMiddleware } from './middlewares';

const router = Router();

export interface IUserRouter {
  registerRouters(): void;
  getRouter(): Router;
}

export default class UsersRouter {
  protected userUseCase: UserUsecase;
  protected handler: Handler;

  constructor(UserUseCase: UserUsecase) {
    this.userUseCase = UserUseCase;
    this.handler = new Handler(UserUseCase);
    this.registerRouters();
  }
  registerRouters(): void {
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

  getRouter(): Router {
    return router;
  }
}
