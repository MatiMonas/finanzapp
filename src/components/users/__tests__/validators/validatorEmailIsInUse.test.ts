import { describe, it, expect, beforeEach } from 'bun:test';
import { ValidatorEmailIsInUse } from 'components/users/validators/validatorEmailIsInUse';
import { EmailAlreadyInUseError } from 'errors';
import { STATUS_CODES, ERROR_CODES, ERROR_NAMES } from 'utils/constants';
import { createMockFn } from '__mocks__/testHelpers';
import { FindByUserEmailBasicData } from 'components/users/types';
import { createMockUserRepository } from '__mocks__/User';

describe('ValidatorEmailIsInUse', () => {
  let validator: ValidatorEmailIsInUse;
  let userRepository: ReturnType<typeof createMockUserRepository>;

  beforeEach(() => {
    userRepository = createMockUserRepository();
    validator = new ValidatorEmailIsInUse(userRepository);
  });

  it('OK - User email es not used', async () => {
    userRepository.findUserByEmail = createMockFn(() => Promise.resolve(null));

    const body = { email: 'test@example.com' };
    const result = await validator.validate(body);

    expect(result).toEqual(body);
  });

  it('ERROR - EmailAlreadyInUseError', async () => {
    const userResponse = {
      id: '1',
      email: 'test@example.com',
    };
    userRepository.findUserByEmail = createMockFn(() =>
      Promise.resolve(userResponse)
    );

    const body = { email: 'test@example.com' };

    try {
      await validator.validate(body);
      expect(true).toBe(false); // Should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(EmailAlreadyInUseError);
    }
  });
});
