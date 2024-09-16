import request from 'supertest';
import express from 'express';
import { countRoutes } from 'utils/helpers/countRouters';
import { STATUS_CODES } from 'utils/constants';
import BudgetRouter from 'modules/budgets/http/router';
import { mockBudgetUseCase } from '__mocks__/Budget';

const app = express();

const budgetRouter = new BudgetRouter(mockBudgetUseCase);
app.use(express.json());
app.use(budgetRouter.getRouter());

describe('BudgetRouter', () => {
  it('should have 3 routes', () => {
    const router = budgetRouter.getRouter();
    const routeCount = countRoutes(router);
    expect(routeCount).toBe(3);
  });

  describe('POST /budget-configurations', () => {
    it('should have a POST /budget-configurations route', async () => {
      (mockBudgetUseCase.createBudget as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/budget-configurations')
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
        .post('/budget-configurations')
        .send({
          budget_configuration_name: 'Basic Configuration',
          budgets: [{ name: 'Savings', percentage: 101 }],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });
  });

  describe('PATCH /budget-configurations/:id', () => {
    it('should have a PATCH /budget-configurations route', async () => {
      (
        mockBudgetUseCase.partialUpdateBudgetConfiguration as jest.Mock
      ).mockResolvedValue(true);

      const response = await request(app)
        .patch('/budget-configurations/1')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [
            { id: 1, name: 'Savings', percentage: 40 },
            { id: 2, name: 'Housing', percentage: 60 },
          ],
        });

      expect(response.status).toBe(STATUS_CODES.NO_CONTENT);
    });

    it('should return 400 if validation fails for PATCH', async () => {
      const response = await request(app)
        .patch('/budget-configurations/1')
        .send({
          user_id: 'invalid-uuid',
          budgets: [{ name: 'Savings', percentage: 101 }],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });
  });

  describe('DELETE /budget-configurations/:id', () => {
    it('should have a DELETE /budget-configurations/:id route', async () => {
      (
        mockBudgetUseCase.deleteBudgetConfiguration as jest.Mock
      ).mockResolvedValue(true);

      const response = await request(app)
        .delete('/budget-configurations/1')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
        });

      expect(response.status).toBe(STATUS_CODES.NO_CONTENT);
    });

    it('should return 400 if validation fails for DELETE', async () => {
      const response = await request(app)
        .delete('/budget-configurations/1')
        .send({
          user_id: 'invalid-uuid',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });
  });
});
