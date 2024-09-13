import Handler from './handler';
import { Router } from 'express';
import createHandler from 'infrastructure/http/createHandler';
import { STATUS_CODES } from 'utils/constants';
import { createUserMiddleware } from './middlewares';
import UserUsecase from '../usecase';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to users
 */

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
    /**
     * @swagger
     * /users:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get all users
     *     responses:
     *       200:
     *         description: A list of users
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   email:
     *                     type: string
     *                   role:
     *                     type: string
     *       500:
     *         description: Internal server error
     */

    router.get('/users', createHandler(this.handler.test));

    /**
     * @swagger
     * /users:
     *   post:
     *     tags:
     *       - Users
     *     summary: Create a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               roles:
     *                 type: array
     *                 items:
     *                   type: integer
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: boolean
     *               example: true
     *       400:
     *         description: Bad request, invalid input
     *       500:
     *         description: Internal server error
     */

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
