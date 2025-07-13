import { describe, it, expect, beforeEach } from 'bun:test';

import Validator from './index';

describe('Validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  it('should set the next validator correctly', () => {
    const nextValidator = new Validator();
    validator.setNext(nextValidator);
    expect(validator['next']).toBe(nextValidator);
  });

  it('should call next validator when validate is called', async () => {
    const nextValidator = new Validator();
    const mockValidate = async () => 'validated';
    nextValidator.validate = mockValidate;

    validator.setNext(nextValidator);
    const result = await validator.validate({});

    expect(result).toBe('validated');
  });

  it('should return data when no next validator is set', async () => {
    const data = { test: 'data' };
    const result = await validator.validate(data);
    expect(result).toEqual(data);
  });
});
