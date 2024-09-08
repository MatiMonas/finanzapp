import { createBudgetMiddleware } from 'domain/budgets/http/middlewares';
import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());
app.post('/test', createBudgetMiddleware, (req, res) => {
  res.status(200).json({ message: 'Success' });
});

describe('createBudgetMiddleware', () => {
  it('OK - should proceed to the next middleware if validation passes', async () => {
    const response = await request(app)
      .post('/test')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [
          { name: 'Savings', percentage: 30 },
          { name: 'Housing', percentage: 60 },
          { name: 'Entertainment', percentage: 10 },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  describe('user_id', () => {
    it('ERROR - "Invalid UUID format", when user_id is invalid', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          user_id: 'invalid-uuid',
          budget_configuration_name: 'Basic Configuration',
          budgets: [
            { name: 'Savings', percentage: 30 },
            { name: 'Housing', percentage: 60 },
            { name: 'Entertainment', percentage: 10 },
          ],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.user_id[0]).toBe('Invalid UUID format');
    });
  });

  describe('budget_configuration_name', () => {
    it('ERROR - "Required", when no budget_configuration_name is sent', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [
            { name: 'Savings', percentage: 30 },
            { name: 'Housing', percentage: 60 },
            { name: 'Entertainment', percentage: 10 },
          ],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.budget_configuration_name[0]).toBe('Required');
    });

    it('ERROR - Budget configuration name must be at least 1 characters long', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budget_configuration_name: '',
          budgets: [
            { name: 'Savings', percentage: 30 },
            { name: 'Housing', percentage: 60 },
            { name: 'Entertainment', percentage: 10 },
          ],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.budget_configuration_name[0]).toBe(
        'Budget configuration name must be at least 1 character long'
      );
    });

    it('ERROR - Budget configuration name must be at most 50 characters long', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budget_configuration_name: 'a'.repeat(51),
          budgets: [
            { name: 'Savings', percentage: 30 },
            { name: 'Housing', percentage: 60 },
            { name: 'Entertainment', percentage: 10 },
          ],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.budget_configuration_name[0]).toBe(
        'Budget configuration name must be at most 50 characters long'
      );
    });
  });

  describe('budgets', () => {
    it('ERROR - "Required", when no budgets field is sent', async () => {
      const response = await request(app).post('/test').send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
      });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.budgets[0]).toBe('Required');
    });

    it('ERROR - Budgets must be a non-empty array', async () => {
      const response = await request(app).post('/test').send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [],
      });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.budgets[0]).toBe('Budgets must be a non-empty array');
    });

    it('ERROR - Budget item name is required', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budget_configuration_name: 'Basic Configuration',
          budgets: [{ name: '', percentage: 30 }],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors['budgets'][0]).toBe('Name is required');
    });

    it('ERROR - Budget item name must be at most 30 characters long', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budget_configuration_name: 'Basic Configuration',
          budgets: [{ name: 'a'.repeat(31), percentage: 30 }],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors['budgets'][0]).toBe(
        'Name must be at most 30 characters long'
      );
    });

    it('ERROR - Budget item percentage must be at least 1', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budget_configuration_name: 'Basic Configuration',
          budgets: [{ name: 'Savings', percentage: 0 }],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors['budgets'][0]).toBe('Percentage must be at least 1');
    });

    it('ERROR - Budget item percentage must be at most 100', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budget_configuration_name: 'Basic Configuration',
          budgets: [{ name: 'Savings', percentage: 101 }],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors['budgets'][0]).toBe('Percentage must be at most 100');
    });

    it('ERROR - Budget item percentage must be an integer', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budget_configuration_name: 'Basic Configuration',
          budgets: [{ name: 'Savings', percentage: 30.5 }],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors['budgets'][0]).toBe('Percentage must be an integer');
    });
  });
});
