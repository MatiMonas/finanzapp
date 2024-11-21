import {
  createBudgetConfigurationMiddleware,
  deleteBudgetConfigurationMiddleware,
  getBudgetConfigurationsMiddleware,
  patchBudgetConfigurationMiddleware,
} from 'components/budgets/http/middlewares';
import express from 'express';
import request from 'supertest';
import { getValidationMessage } from 'utils/helpers/functions';
import moment from 'moment';

const app = express();
app.use(express.json());

app.get(
  '/budget-configurations',
  getBudgetConfigurationsMiddleware,
  (req, res) => {
    res.status(200).json({ message: 'Success' });
  }
);

app.post(
  '/budget-configurations',
  createBudgetConfigurationMiddleware,
  (req, res) => {
    res.status(200).json({ message: 'Success' });
  }
);
app.patch(
  '/budget-configurations/:id',
  patchBudgetConfigurationMiddleware,
  (req, res) => {
    res.status(200).json({ message: 'Success' });
  }
);
app.delete(
  '/budget-configurations/:id',
  deleteBudgetConfigurationMiddleware,
  (req, res) => {
    res.status(200).json({ message: 'Success' });
  }
);

describe('getBudgetConfigurationsMiddleware', () => {
  it('OK - should proceed to the next middleware if validation passes', async () => {
    const now = moment().format('YYYY-MM-DD');
    const query = {
      id: '1',
      name: 'Budget A',
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      created_at: now,
      updated_at: now,
    };
    const response = await request(app)
      .get('/budget-configurations')
      .query(query);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  describe('id', () => {
    it('ERROR - "ID must be a number" when id is not a valid number', async () => {
      const query = { id: 'abc' };
      const response = await request(app)
        .get('/budget-configurations')
        .query(query);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(query);
      expect(response.status).toBe(400);
      expect(field_errors.id[0]).toBe('ID must be a number');
    });

    it('ERROR - "Invalid value" when id is missing', async () => {
      const query = { id: '' };
      const response = await request(app)
        .get('/budget-configurations')
        .query(query);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(query);
      expect(response.status).toBe(400);
      expect(field_errors.id[0]).toBe('ID must be a number');
    });
  });

  describe('name', () => {
    it('OK - Should accept a valid name', async () => {
      const query = { name: 'Valid Name' };
      const response = await request(app)
        .get('/budget-configurations')
        .query(query);

      expect(response.status).toBe(200);
    });

    it('OK - Should handle missing name', async () => {
      const response = await request(app).get('/budget-configurations');

      expect(response.status).toBe(200);
    });
  });

  describe('user_id', () => {
    it('OK - Should accept a valid UUID', async () => {
      const query = { user_id: '123e4567-e89b-12d3-a456-426614174000' };
      const response = await request(app)
        .get('/budget-configurations')
        .query(query);

      expect(response.status).toBe(200);
    });

    it('ERROR - "Invalid UUID format" when user_id is invalid', async () => {
      const query = { user_id: 'invalid-uuid' };
      const response = await request(app)
        .get('/budget-configurations')
        .query(query);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(query);
      expect(response.status).toBe(400);
      expect(field_errors.user_id[0]).toBe('Invalid UUID format');
    });
  });

  describe('created_at, updated_at and deleted_at', () => {
    it('OK - should accept valid date strings', async () => {
      const now = moment().format('YYYY-MM-DD');
      const query = { created_at: now, updated_at: now, deleted_at: now };
      const response = await request(app)
        .get('/budget-configurations')
        .query(query);

      expect(response.status).toBe(200);
    });

    it('ERROR - "Invalid Date format" when date is not a valid date string', async () => {
      const query = { created_at: 'invalid-date' };
      const response = await request(app)
        .get('/budget-configurations')
        .query(query);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(query);
      expect(response.status).toBe(400);
      expect(field_errors.created_at[0]).toBe('Invalid Date format');
    });
  });
});
describe('createBudgetMiddleware', () => {
  it('OK - should proceed to the next middleware if validation passes', async () => {
    const mockData = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      budget_configuration_name: 'Basic Configuration',
      budgets: [
        { name: 'Savings', percentage: 30 },
        { name: 'Housing', percentage: 60 },
        { name: 'Entertainment', percentage: 10 },
      ],
    };

    const response = await request(app)
      .post('/budget-configurations')
      .send(mockData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  describe('user_id', () => {
    it('ERROR - "Invalid UUID format", when user_id is invalid', async () => {
      const mockData = {
        user_id: 'invalid-uuid',
        budget_configuration_name: 'Basic Configuration',
        budgets: [
          { name: 'Savings', percentage: 30 },
          { name: 'Housing', percentage: 60 },
          { name: 'Entertainment', percentage: 10 },
        ],
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors.user_id[0]).toBe('Invalid UUID format');
    });
  });

  describe('budget_configuration_name', () => {
    it('ERROR - "Required", when no budget_configuration_name is sent', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [
          { name: 'Savings', percentage: 30 },
          { name: 'Housing', percentage: 60 },
          { name: 'Entertainment', percentage: 10 },
        ],
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors.budget_configuration_name[0]).toBe('Required');
    });

    it('ERROR - Budget configuration name must be at least 1 character long', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: '',
        budgets: [
          { name: 'Savings', percentage: 30 },
          { name: 'Housing', percentage: 60 },
          { name: 'Entertainment', percentage: 10 },
        ],
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors.budget_configuration_name[0]).toBe(
        'Budget configuration name must be at least 1 character long'
      );
    });

    it('ERROR - Budget configuration name must be at most 50 characters long', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'a'.repeat(51),
        budgets: [
          { name: 'Savings', percentage: 30 },
          { name: 'Housing', percentage: 60 },
          { name: 'Entertainment', percentage: 10 },
        ],
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors.budget_configuration_name[0]).toBe(
        'Budget configuration name must be at most 50 characters long'
      );
    });
  });

  describe('budgets', () => {
    it('ERROR - "Required", when no budgets field is sent', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors.budgets[0]).toBe('Required');
    });

    it('ERROR - Budgets must be a non-empty array', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [],
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors.budgets[0]).toBe('Budgets must be a non-empty array');
    });

    it('ERROR - Budget item name is required', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [{ name: '', percentage: 30 }],
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors['budgets'][0]).toBe('Name is required');
    });

    it('ERROR - Budget item name must be at most 30 characters long', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [{ name: 'a'.repeat(31), percentage: 30 }],
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors['budgets'][0]).toBe(
        'Name must be at most 30 characters long'
      );
    });

    it('ERROR - Budget item percentage must be at least 1', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [{ name: 'Savings', percentage: 0 }],
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors['budgets'][0]).toBe('Percentage must be at least 1');
    });

    it('ERROR - Budget item percentage must be at most 100', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [{ name: 'Savings', percentage: 101 }],
      };

      const response = await request(app)
        .post('/budget-configurations')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors['budgets'][0]).toBe('Percentage must be at most 100');
    });
  });
});

describe('updateBudgetMiddleware', () => {
  it('OK - Passes with correct user_id', async () => {
    const response = await request(app)
      .patch('/budget-configurations/1')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [
          { id: 1, percentage: 30 },
          { id: 2, name: 'Housing', percentage: 70 },
          { id: 3, delete: true },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  it('OK - Passes with both budgets and budget_configuration_name', async () => {
    const response = await request(app)
      .patch('/budget-configurations/1')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [
          { id: 1, name: 'Savings', percentage: 30 },
          { id: 2, name: 'Housing', percentage: 60 },
          { id: 3, name: 'Entertainment', percentage: 10 },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  it('OK - Passes only with budget_configuration_name', async () => {
    const response = await request(app).patch('/budget-configurations/1').send({
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      budget_configuration_name: 'Basic Configuration',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  it('OK - Passes only with updating a budget name', async () => {
    const response = await request(app)
      .patch('/budget-configurations/1')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [{ id: 1, name: 'Savings' }],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  it('OK - Updating only a budget percentage', async () => {
    const response = await request(app)
      .patch('/budget-configurations/1')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [{ id: 1, percentage: 20 }],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  it('OK - Updating a budget name and creating a new budget', async () => {
    const response = await request(app)
      .patch('/budget-configurations/1')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 'Basic Configuration',
        budgets: [
          { id: 1, name: 'Savings' },
          { name: 'Food', percentage: 40, create: true },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  it('OK - should proceed if a budget have create at true with all required properties', async () => {
    const response = await request(app)
      .patch('/budget-configurations/1')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [
          { id: 1, percentage: 20 },
          { id: 2, name: 'Housing', percentage: 70 },
          { name: 'Savings', percentage: 10, create: true },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });
  it('OK - should proceed if a budget have delete at true', async () => {
    const response = await request(app)
      .patch('/budget-configurations/1')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [
          { id: 1, percentage: 30 },
          { id: 2, name: 'Housing', percentage: 70 },
          { id: 3, delete: true },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  it('ERROR - Should fail if user_id is not sent', async () => {
    const mockData = {
      budgets: [
        { id: 1, percentage: 30 },
        { id: 2, name: 'Housing', percentage: 70 },
        { id: 3, delete: true },
      ],
    };

    const response = await request(app)
      .patch('/budget-configurations/1')
      .send(mockData);

    const {
      errors: { field_errors },
      input_data,
    } = response.body;

    expect(input_data).toEqual(mockData);
    expect(response.status).toBe(400);
    expect(field_errors.user_id[0]).toBe(
      getValidationMessage('user_id', 'a UUID string', 'is required')
    );
  });

  it('ERROR - Should fail if user_id is not a UUID', async () => {
    const mockData = { user_id: '123' };

    const response = await request(app)
      .delete('/budget-configurations/1')
      .send(mockData);

    const {
      errors: { field_errors },
      input_data,
    } = response.body;

    expect(input_data).toEqual(mockData);
    expect(response.status).toBe(400);
    expect(field_errors.user_id[0]).toBe('Invalid UUID format');
  });
  it('ERROR - should fail if neither budgets nor budget_configuration_name is provided', async () => {
    const mockData = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const response = await request(app)
      .patch('/budget-configurations/1')
      .send(mockData);

    const {
      errors: { field_errors },
      input_data,
    } = response.body;

    expect(input_data).toEqual(mockData);
    expect(response.status).toBe(400);
    expect(field_errors['budgets']).not.toBeDefined();
    expect(field_errors['budget_configuration_name']).not.toBeDefined();
    expect(field_errors['missing_parameters'][0]).toBe(
      'Either budgets or budget_configuration_name must be provided'
    );
  });

  it('ERROR - Properties "name" and "percentage" must be provided if "create" is true', async () => {
    const mockData = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      budgets: [{ percentage: 100, create: true }],
    };

    const response = await request(app)
      .patch('/budget-configurations/1')
      .send(mockData);

    const {
      errors: { field_errors },
      input_data,
    } = response.body;

    expect(input_data).toEqual(mockData);
    expect(response.status).toBe(400);
    expect(field_errors['budgets'][0]).toBe(
      'Properties "name" and "percentage" must be provided if "create" is true'
    );
  });

  describe('budget_configuration_name', () => {
    it('ERROR - "Property "budget_configuration_name" must be a string"', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: 1,
      };
      const response = await request(app)
        .patch('/budget-configurations/1')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors['budget_configuration_name'][0]).toBe(
        getValidationMessage('budget_configuration_name', 'a string')
      );
    });
    it('ERROR - "Budget configuration name must be at least 1 character long"', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_configuration_name: '',
      };
      const response = await request(app)
        .patch('/budget-configurations/1')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors['budget_configuration_name'][0]).toBe(
        'Budget configuration name must be at least 1 character long'
      );
    });
  });

  describe('budgets', () => {
    it('ERROR - "Budgets must be a non-empty array" if budgets is empty', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [],
      };

      const response = await request(app)
        .patch('/budget-configurations/1')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors['budgets'][0]).toBe(
        'Budgets must be a non-empty array'
      );
    });

    it('ERROR - "Cannot provide name or percentage when delete is true"', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [{ id: 1, delete: true, name: 'Savings', percentage: 30 }],
      };

      const response = await request(app)
        .patch('/budget-configurations/1')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors.budgets[0]).toBe(
        'Cannot provide name or percentage when delete is true'
      );
    });

    it('ERROR - Should fail if both create and delete are true', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [
          {
            id: 1,
            name: 'Savings',
            percentage: 30,
            create: true,
            delete: true,
          },
        ],
      };

      const response = await request(app)
        .patch('/budget-configurations/1')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors).toHaveProperty('budgets');
      expect(field_errors.budgets[0]).toBe(
        'Both create and delete cannot be true'
      );
    });

    it('ERROR - Delete false/missing -"If delete or create are false, at least one of name or percentage must be provided"', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [{ id: 1, delete: false }],
      };

      const response = await request(app)
        .patch('/budget-configurations/1')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors.budgets[0]).toBe(
        'If delete or create are false/null, at least one of name or percentage must be provided'
      );
    });

    it('ERROR - Create false/missing -"If delete or create are false, at least one of name or percentage must be provided"', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [{ id: 1, create: false }],
      };

      const response = await request(app)
        .patch('/budget-configurations/1')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors.budgets[0]).toBe(
        'If delete or create are false/null, at least one of name or percentage must be provided'
      );
    });

    it('ERROR - "Cannot provide name or percentage when delete is true"', async () => {
      const mockData = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        budgets: [{ id: 1, delete: true, name: 'Old Budget', percentage: 50 }],
      };

      const response = await request(app)
        .patch('/budget-configurations/1')
        .send(mockData);

      const {
        errors: { field_errors },
        input_data,
      } = response.body;

      expect(input_data).toEqual(mockData);
      expect(response.status).toBe(400);
      expect(field_errors['budgets'][0]).toBe(
        'Cannot provide name or percentage when delete is true'
      );
    });
    describe('ID', () => {
      it('ERROR - "Property "id" must be a number"', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: '1', name: 'Savings', percentage: 30 }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe(
          getValidationMessage('id', 'a number')
        );
      });

      it('ERROR - "ID must be a positive number"', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: -1, name: 'Savings', percentage: 30 }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe('ID must be a positive number');
      });
    });

    describe('Name', () => {
      it('ERROR - Property "name" must be a string', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: 1, name: 1, percentage: 30 }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe(
          getValidationMessage('name', 'a string')
        );
      });

      it('ERROR - "Name is required if property "name" is sent', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: 1, name: '', percentage: 30 }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe(
          'Name is required if property "name" is sent'
        );
      });

      it('ERROR - "Name must be at most 30 characters long"', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: 1, name: 'a'.repeat(31), percentage: 30 }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe(
          'Name must be at most 30 characters long'
        );
      });
    });

    describe('Percentage', () => {
      it('ERROR - Property "percentage" must be a number', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: 1, name: 'Basic', percentage: '30' }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe(
          getValidationMessage('percentage', 'a number')
        );
      });

      it('ERROR - "Percentage must be at least 1"', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: 1, name: 'Basic', percentage: 0 }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe(
          'Percentage must be at least 1'
        );
      });

      it('ERROR - "Percentage must be at most 100"', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: 1, name: 'Basic', percentage: 101 }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe(
          'Percentage must be at most 100'
        );
      });
    });

    describe('Create', () => {
      it('ERROR - "Create property must be boolean" if create is not a boolean', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: 1, create: 'true' }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe(
          getValidationMessage('create', 'boolean')
        );
      });
    });

    describe('Delete', () => {
      it('ERROR - "Delete property must be boolean" if delete is not a boolean', async () => {
        const mockData = {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          budgets: [{ id: 1, delete: 'true' }],
        };

        const response = await request(app)
          .patch('/budget-configurations/1')
          .send(mockData);

        const {
          errors: { field_errors },
          input_data,
        } = response.body;

        expect(input_data).toEqual(mockData);
        expect(response.status).toBe(400);
        expect(field_errors['budgets'][0]).toBe(
          getValidationMessage('delete', 'boolean')
        );
      });
    });
  });
});

describe('deleteBudgetConfigurationMiddleware', () => {
  it('OK - Passes with correct user_id', async () => {
    const response = await request(app)
      .delete('/budget-configurations/1')
      .send({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  it('ERROR - Should fail if user_id is not sent', async () => {
    const response = await request(app)
      .delete('/budget-configurations/1')
      .send({});

    const {
      errors: { field_errors },
      input_data,
    } = response.body;

    expect(input_data).toEqual({});
    expect(response.status).toBe(400);
    expect(field_errors.user_id[0]).toBe(
      getValidationMessage('user_id', 'a UUID string', 'is required')
    );
  });
  it('ERROR - Should fail if user_id is not a UUID', async () => {
    const mockData = { user_id: '123' };
    const response = await request(app)
      .delete('/budget-configurations/1')
      .send(mockData);

    const {
      errors: { field_errors },
      input_data,
    } = response.body;

    expect(input_data).toEqual(mockData);
    expect(response.status).toBe(400);
    expect(field_errors.user_id[0]).toBe('Invalid UUID format');
  });
});
