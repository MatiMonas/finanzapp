import request from 'supertest';
import express from 'express';
import UserUseCase from 'users/usecase';
import UsersRouter from 'users/http/router';
import { mockUserUseCase } from '../__mocks__';
import { countRoutes } from 'utils/helpers/countRouters';
import { STATUS_CODES } from 'utils/constants';

const app = express();

const usersRouter = new UsersRouter(mockUserUseCase);
app.use(express.json());
app.use(usersRouter.getRouter());

describe('UsersRouter', () => {
  it('should have 2 routes', () => {
    const router = usersRouter.getRouter();
    const routeCount = countRoutes(router);
    expect(routeCount).toBe(2);
  });

  it('should have a GET /users route', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
  });

  it('should have a POST /users route', async () => {
    (mockUserUseCase.create as jest.Mock).mockResolvedValue(true);

    const response = await request(app)
      .post('/users')
      .send({
        username: 'validusername',
        email: 'validemail@example.com',
        password: 'Valid1Password!',
        roles: [1, 2, 3],
      });

    expect(response.status).toBe(STATUS_CODES.CREATED);
  });
});
