import { describe, it, expect, beforeEach } from 'bun:test';
import { ValidatorUserEmailExists } from 'components/users/validators/validatorUserEmailExists';
import { UserNotFoundError } from 'errors';
import { createMockFn } from '__mocks__/testHelpers';
import { createMockUserRepository } from '__mocks__/User';

describe('ValidatorUserEmailExists', () => {
  let validator: ValidatorUserEmailExists;
  let userRepository: ReturnType<typeof createMockUserRepository>;

  beforeEach(() => {
    userRepository = createMockUserRepository();
    validator = new ValidatorUserEmailExists(userRepository);
  });

  it('should pass validation if user with the email exists', async () => {
    userRepository.findUserByEmail = createMockFn(() =>
      Promise.resolve({
        id: '1',
        email: 'existing@example.com',
      })
    );

    const body = { email: 'existing@example.com' };
    const result = await validator.validate(body);
    expect(result).toEqual(body);
  });

  it('should throw UserNotFoundError if user with the email does not exist', async () => {
    userRepository.findUserByEmail = createMockFn(() => Promise.resolve(null));

    const body = { email: 'nonexistent@example.com' };

    try {
      await validator.validate(body);
      expect(true).toBe(false); // Should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundError);
    }
  });
});
