import request from 'supertest';
import express from 'express';
import { countRoutes } from 'utils/helpers/countRouters';
import { STATUS_CODES } from 'utils/constants';
import MonthlyWagesRouter from 'modules/monthly-wages/http/router';
import { mockMonthlyWagesUseCase } from '__mocks__/MonthlyWages';

const app = express();

const monthlyWagesRouter = new MonthlyWagesRouter(mockMonthlyWagesUseCase);
app.use(express.json());
app.use(monthlyWagesRouter.getRouter());

describe('MonthlyWagesRouter', () => {
  it('should have 1 routes', () => {
    const router = monthlyWagesRouter.getRouter();
    const routeCount = countRoutes(router);
    expect(routeCount).toBe(1);
  });

  it('POST /monthly-wages should return 201', async () => {
    (mockMonthlyWagesUseCase.createMonthlyWage as jest.Mock).mockResolvedValue(
      true
    );
    const response = await request(app).post('/monthly-wages');
    console.log(response);
    expect(response.status).toBe(STATUS_CODES.CREATED);
  });
});
