import express from 'express';
import request from 'supertest';
import { createUserMiddleware } from 'users/http/middlewares';

const app = express();
app.use(express.json());
app.post('/test', createUserMiddleware, (req, res) => {
  res.status(200).json({ message: 'Success' });
});

describe('createUserMiddleware', () => {
  it('OK - should proceed to the next middleware if validation passes', async () => {
    const response = await request(app)
      .post('/test')
      .send({
        username: 'validusername',
        email: 'validemail@example.com',
        password: 'Valid1Password!',
        roles: [1, 2, 3],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success');
  });

  describe('Username', () => {
    it('ERROR - "Required", when no username field is sent', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          email: 'validemail@example.com',
          password: 'Valid1Password!',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);

      expect(fieldErrors.username[0]).toBe('Required');
    });

    it('ERROR - Username is required, Username must be at least 2 characters long', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: '',
          email: 'validemail@example.com',
          password: 'Valid1Password!',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);

      expect(fieldErrors.username[0]).toBe('Username is required');
      expect(fieldErrors.username[1]).toBe(
        'Username must be at least 2 characters long'
      );
    });
    it('ERROR - Username must be at most 25 characters long', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'user123456789012345678901234567890',
          email: 'validemail@example.com',
          password: 'Valid1Password!',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);

      expect(fieldErrors.username[0]).toBe(
        'Username must be at most 25 characters long'
      );
    });
  });

  describe('Email', () => {
    it('ERROR - "Required", when no email field is sent', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'validusername',
          password: 'Valid1Password!',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.email[0]).toBe('Required');
    });

    it('ERROR - Email is not a valid email address', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'validusername',
          email: 'invalid-email',
          password: 'Valid1Password!',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.email[0]).toBe('Invalid email address');
    });

    it('ERROR - Email must be at most 30 characters long', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'validusername',
          email: 'a'.repeat(31) + '@example.com',
          password: 'Valid1Password!',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.email[0]).toBe(
        'Email must be at most 30 characters long'
      );
    });
  });

  describe('Password', () => {
    it('ERROR - (password) "Required", when no password field is sent', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'validusername',
          email: 'validemail@example.com',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.password[0]).toBe('Required');
    });

    it('ERROR - Password must be at least 8 characters long', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'validusername',
          email: 'validemail@example.com',
          password: 'Short1!',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.password[0]).toBe(
        'Password must be at least 8 characters long'
      );
    });

    it('ERROR - Password must contain at least one uppercase letter', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'validusername',
          email: 'validemail@example.com',
          password: 'password1!',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.password[0]).toBe(
        'Password must contain at least one uppercase letter'
      );
    });

    it('ERROR - Password must contain at least one number', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'validusername',
          email: 'validemail@example.com',
          password: 'Password!',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.password[0]).toBe(
        'Password must contain at least one number'
      );
    });

    it('ERROR - Password must contain at least one special character', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          username: 'validusername',
          email: 'validemail@example.com',
          password: 'Password1',
          roles: [1, 2, 3],
        });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.password[0]).toBe(
        'Password must contain at least one special character'
      );
    });
  });

  describe('Roles', () => {
    it('ERROR - (roles) "Required", when no roles field is sent', async () => {
      const response = await request(app).post('/test').send({
        username: 'validusername',
        email: 'validemail@example.com',
        password: 'Valid1Password!',
      });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.roles[0]).toBe('Required');
    });

    it('ERROR - Roles must be an array of numbers', async () => {
      const response = await request(app).post('/test').send({
        username: 'validusername',
        email: 'validemail@example.com',
        password: 'Valid1Password!',
        roles: 'not-an-array',
      });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.roles[0]).toBe('Expected array, received string');
    });

    it('ERROR - Roles array cannot be empty', async () => {
      const response = await request(app).post('/test').send({
        username: 'validusername',
        email: 'validemail@example.com',
        password: 'Valid1Password!',
        roles: [],
      });

      const {
        errors: { fieldErrors },
      } = response.body;

      expect(response.status).toBe(400);
      expect(fieldErrors.roles[0]).toBe(
        'Roles must be a non-empty array of numbers'
      );
    });
  });
});
