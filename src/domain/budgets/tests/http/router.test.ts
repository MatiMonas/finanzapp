import request from 'supertest';
import express from 'express';
import { countRoutes } from 'utils/helpers/countRouters';
import { STATUS_CODES } from 'utils/constants';
import BudgetRouter from 'domain/budgets/http/router';
import { mockBudgetUseCase } from '__mocks__/Budget';

const app = express();

const budgetRouter = new BudgetRouter(mockBudgetUseCase);
app.use(express.json());
app.use(budgetRouter.getRouter());

describe('BudgetRouter', () => {
  it('should have 1 route', () => {
    const router = budgetRouter.getRouter();
    const routeCount = countRoutes(router);
    expect(routeCount).toBe(1); // Dado que solo tienes la ruta POST /budgets
  });

  it('should have a POST /budgets route', async () => {
    (mockBudgetUseCase.createBudget as jest.Mock).mockResolvedValue(true);

    const response = await request(app)
      .post('/budgets')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [
          { name: 'Savings', percentage: 30 },
          { name: 'Housing', percentage: 60 },
          { name: 'Entertainment', percentage: 10 },
        ],
      });

    expect(response.status).toBe(STATUS_CODES.CREATED);
  });

  it('should return 400 if validation fails', async () => {
    const response = await request(app)
      .post('/budgets')
      .send({
        budget_configuration_name: 'Basic Configuration',
        budgets: [{ name: 'Savings', percentage: 101 }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'fail');
  });
});
