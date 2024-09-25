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
  it('should have 5 routes', () => {
    const router = budgetRouter.getRouter();
    const routeCount = countRoutes(router);
    expect(routeCount).toBe(5);
  });

  describe(' GET /budgets/:id', () => {
    it('should have a GET /budgets/:id route', async () => {
      const mockResponse = {
        id: 6,
        user_id: 'c270dfc2-ac37-46b1-83ad-c3450d15425e',
        name: 'Test2',
        percentage: 40,
        remaining_allocation: 0,
        budget_configuration_id: 3,
        monthly_wage_id: null,
        created_at: '2024-09-20T02:47:06.154Z',
        updated_at: '2024-09-20T02:48:11.015Z',
        deleted_at: null,
        alerts: [],
        budget_configuration: {
          id: 3,
          name: 'Test 1',
          user_id: 'c270dfc2-ac37-46b1-83ad-c3450d15425e',
          created_at: '2024-09-20T02:46:36.551Z',
          updated_at: '2024-09-20T02:48:11.015Z',
          deleted_at: null,
        },
        monthly_wage: null,
      };

      (mockBudgetUseCase.getBudgetDetails as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const response = await request(app).get('/budgets/6');
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.data).toEqual(mockResponse);
    });
  });
  describe('GET /budget-configuraitons', () => {
    it('should have a GET /budget-configurations route', async () => {
      const mockResponse = [
        {
          id: 1,
          name: 'Basic Configuration',
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          created_at: '2024-01-01',
          updated_at: '2024-01-02',
          deleted_at: null,
          budgets: [
            {
              name: 'Savings',
              percentage: 30,
            },
          ],
        },
      ];

      (
        mockBudgetUseCase.getBudgetConfigurations as jest.Mock
      ).mockResolvedValue(mockResponse);

      const response = await request(app).get('/budget-configurations');
      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.data).toEqual(mockResponse);
    });
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

      expect(response.body.data).toBe(true);
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
      expect(response.body.data).toBe(undefined);
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

      expect(response.body.data).toBe(undefined);
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
