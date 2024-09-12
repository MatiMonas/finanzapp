import request from 'supertest';
import express from 'express';
import { validateIdMiddleware } from './validateIdMiddleware';

const app = express();

app.use(express.json());
app.patch('/test/:id', validateIdMiddleware, (req, res) => {
  res.status(200).json({ status: 'success' });
});

describe('validateIdMiddleware', () => {
  it('should return 200 OK for a valid positive number ID', async () => {
    const response = await request(app).patch('/test/123');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });

  it('should return 400 Bad Request for an invalid ID (not a number)', async () => {
    const response = await request(app).patch('/test/abc');
    expect(response.status).toBe(400);
    expect(response.body.errors.message).toBe('ID must be a number');
  });

  it('should return 400 Bad Request for a negative number ID', async () => {
    const response = await request(app).patch('/test/-123');
    expect(response.status).toBe(400);
    const errors = JSON.parse(response.body.errors.message);
    expect(errors[0].message).toBe('ID must be a positive number');
  });

  it('should return 400 Bad Request for missing ID', async () => {
    const response = await request(app).patch('/test/');
    expect(response.status).toBe(404);
  });
});
