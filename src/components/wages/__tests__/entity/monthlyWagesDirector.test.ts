import { describe, it, expect, beforeEach } from 'bun:test';
import { WageBuilder } from 'components/wages/entity/monthlyWagesBuilder';
import { WageDirector } from 'components/wages/entity/monthlyWagesDirector';
import { Wage } from 'components/wages/entity';

describe('WageDirector', () => {
  let director: WageDirector;
  let builder: WageBuilder;

  beforeEach(() => {
    builder = new WageBuilder();
    director = new WageDirector(builder);
  });

  it('should create a wage director instance', () => {
    expect(director).toBeInstanceOf(WageDirector);
  });

  it('should construct a wage with provided parameters', () => {
    const userId = 'user-uuid';
    const amount = 1000;
    const date = new Date('2024-01-01');

    const result = director.construct(userId, amount, date);

    expect(result).toBeInstanceOf(Wage);
    expect(result.user_id).toBe(userId);
    expect(result.amount).toBe(amount);
    expect(result.date).toBe(date);
  });

  it('should construct wage with different parameters', () => {
    const userId = 'another-user-uuid';
    const amount = 2000;
    const date = new Date('2024-02-15');

    const result = director.construct(userId, amount, date);

    expect(result).toBeInstanceOf(Wage);
    expect(result.user_id).toBe(userId);
    expect(result.amount).toBe(amount);
    expect(result.date).toBe(date);
  });

  it('should construct wage with zero amount', () => {
    const userId = 'user-uuid';
    const amount = 0;
    const date = new Date('2024-01-01');

    const result = director.construct(userId, amount, date);

    expect(result).toBeInstanceOf(Wage);
    expect(result.user_id).toBe(userId);
    expect(result.amount).toBe(amount);
    expect(result.date).toBe(date);
  });

  it('should construct wage with decimal amount', () => {
    const userId = 'user-uuid';
    const amount = 1500.75;
    const date = new Date('2024-01-01');

    const result = director.construct(userId, amount, date);

    expect(result).toBeInstanceOf(Wage);
    expect(result.user_id).toBe(userId);
    expect(result.amount).toBe(amount);
    expect(result.date).toBe(date);
  });
});
