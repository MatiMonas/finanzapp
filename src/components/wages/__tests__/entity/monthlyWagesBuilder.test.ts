import { describe, it, expect, beforeEach } from 'bun:test';
import { WageBuilder } from 'components/wages/entity/monthlyWagesBuilder';
import { Wage } from 'components/wages/entity';

describe('WageBuilder', () => {
  let builder: WageBuilder;

  beforeEach(() => {
    builder = new WageBuilder();
  });

  it('should create a wage builder instance', () => {
    expect(builder).toBeInstanceOf(WageBuilder);
  });

  it('should set user_id', () => {
    const userId = 'user-uuid';
    builder.setUserId(userId);
    expect(builder).toHaveProperty('user_id');
  });

  it('should set amount', () => {
    const amount = 1000;
    builder.setAmount(amount);
    expect(builder).toHaveProperty('amount');
  });

  it('should set month', () => {
    const date = new Date('2024-01-01');
    builder.setMonth(date);
    expect(builder).toHaveProperty('date');
  });

  it('should set exchange rate', () => {
    const exchangeRate = 1.5;
    builder.setExchangeRate(exchangeRate);
    expect(builder).toHaveProperty('exchange_rate');
  });

  it('should build wage object', () => {
    const userId = 'user-uuid';
    const amount = 1000;
    const date = new Date('2024-01-01');
    const exchangeRate = 1.5;

    const result = builder
      .setUserId(userId)
      .setAmount(amount)
      .setMonth(date)
      .setExchangeRate(exchangeRate)
      .build();

    expect(result).toBeInstanceOf(Wage);
    expect(result.user_id).toBe(userId);
    expect(result.amount).toBe(amount);
    expect(result.date).toBe(date);
    expect(result.exchange_rate).toBe(exchangeRate);
  });

  it('should build wage with default values', () => {
    const result = builder.build();

    expect(result).toBeInstanceOf(Wage);
    expect(result.amount).toBe(0.0);
    expect(result.exchange_rate).toBe(0.0);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });
});
