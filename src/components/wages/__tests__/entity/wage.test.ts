import { describe, it, expect, beforeEach } from 'bun:test';
import { Wage } from 'components/wages/entity';

describe('Wage Entity', () => {
  it('should create a wage instance with correct properties', () => {
    const user_id = 'user-uuid';
    const amount = 1000;
    const date = new Date('2024-01-01');
    const exchange_rate = 1.5;
    const created_at = new Date('2024-01-01T10:00:00Z');
    const updated_at = new Date('2024-01-01T10:00:00Z');
    const deleted_at = undefined;

    const wage = new Wage(
      user_id,
      amount,
      date,
      exchange_rate,
      created_at,
      updated_at,
      deleted_at
    );

    expect(wage.user_id).toBe(user_id);
    expect(wage.amount).toBe(amount);
    expect(wage.date).toBe(date);
    expect(wage.exchange_rate).toBe(exchange_rate);
    expect(wage.created_at).toBe(created_at);
    expect(wage.updated_at).toBe(updated_at);
    expect(wage.deleted_at).toBeUndefined();
  });

  it('should create a wage instance without deleted_at', () => {
    const user_id = 'user-uuid';
    const amount = 1000;
    const date = new Date('2024-01-01');
    const exchange_rate = 1.5;
    const created_at = new Date('2024-01-01T10:00:00Z');
    const updated_at = new Date('2024-01-01T10:00:00Z');

    const wage = new Wage(
      user_id,
      amount,
      date,
      exchange_rate,
      created_at,
      updated_at
    );

    expect(wage.user_id).toBe(user_id);
    expect(wage.amount).toBe(amount);
    expect(wage.date).toBe(date);
    expect(wage.exchange_rate).toBe(exchange_rate);
    expect(wage.created_at).toBe(created_at);
    expect(wage.updated_at).toBe(updated_at);
    expect(wage.deleted_at).toBeUndefined();
  });
});
