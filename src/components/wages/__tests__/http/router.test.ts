import request from 'supertest';
import express from 'express';
import { countRoutes } from 'utils/helpers/countRouters';
import { STATUS_CODES } from 'utils/constants';
import WagesRouter from 'components/wages/http/router';
import { mockWagesUseCase } from '__mocks__/Wages';

const app = express();

const wagesRouter = new WagesRouter(mockWagesUseCase);
app.use(express.json());
app.use(wagesRouter.getRouter());

describe('WagesRouter', () => {
  it('should have 1 routes', () => {
    const router = wagesRouter.getRouter();
    const routeCount = countRoutes(router);
    expect(routeCount).toBe(1);
  });

  it('POST /wages should return 201', async () => {
    (mockWagesUseCase.createWage as jest.Mock).mockResolvedValue(true);
    const response = await request(app).post('/wages');
    console.log(response);
    expect(response.status).toBe(STATUS_CODES.CREATED);
  });
});
