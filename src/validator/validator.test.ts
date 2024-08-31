import Validator from 'validator';

class MockValidator extends Validator {
  validate(body: any): any {
    body.validated = true;
    return super.validate(body);
  }
}

describe('Validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  test('should set the next validator correctly', () => {
    const nextValidator = new Validator();
    validator.setNext(nextValidator);

    expect(validator.next).toBe(nextValidator);
  });

  test('should return the body if there is no next validator', () => {
    const body = { data: 'test' };

    const result = validator.validate(body);

    expect(result).toBe(body);
  });

  test('should pass the body to the next validator if there is one', () => {
    const nextValidator = new MockValidator();
    validator.setNext(nextValidator);

    const body = { data: 'test' };
    const result = validator.validate(body);

    expect(result.validated).toBe(true);
  });

  test('should create a validator chain and validate through it', () => {
    const validator1 = new MockValidator();
    const validator2 = new MockValidator();
    const validator3 = new MockValidator();

    const chain = Validator.createValidatorChain([
      validator1,
      validator2,
      validator3,
    ]);

    const body = { data: 'test' };
    const result = chain.validate(body);

    expect(result.validated).toBe(true);
    // Test if the chain is correctly set up
    expect(validator1.next).toBe(validator2);
    expect(validator2.next).toBe(validator3);
    expect(validator3.next).toBe(null);
  });
});
