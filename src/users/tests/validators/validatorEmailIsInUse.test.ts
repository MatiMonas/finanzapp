import UserRepository from 'users/repository/user-repository';
import { EmailAlreadyInUseError } from 'errors';
import { ValidatorEmailIsInUse } from 'users/validators/validatorEmailIsInUse';
import { ERROR_STATUS_CODES, ERROR_CODES, ERROR_NAMES } from 'utils/constants';

const mockUserRepository = () => {
  return {
    findUserByEmail: jest.fn(),
  };
};

describe('ValidatorEmailIsInUse', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let validator: ValidatorEmailIsInUse;

  beforeEach(() => {
    userRepository =
      mockUserRepository() as unknown as jest.Mocked<UserRepository>;
    validator = new ValidatorEmailIsInUse(userRepository);
  });

  test('OK - User email es not used', async () => {
    userRepository.findUserByEmail.mockResolvedValueOnce(null);

    const body = { email: 'test@example.com' };

    const result = await validator.validate(body);
    expect(result).toEqual(body);
  });

  test('ERROR - EmailAlreadyInUseError', async () => {
    const userResponse = { id: 1, email: 'test@example.com', role: 'user' };

    userRepository.findUserByEmail.mockResolvedValueOnce(userResponse);

    const body = {
      email: 'test@example.com',
    };

    try {
      await validator.validate(body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(EmailAlreadyInUseError);
      expect(error.statusCode).toBe(ERROR_STATUS_CODES.CONFLICT);
      expect(error.code).toBe(ERROR_CODES.EMAIL_ALREADY_IN_USE);
      expect(error.name).toBe(ERROR_NAMES.EMAIL_ALREADY_IN_USE);
      expect(error.message).toBe('Email address already in use.');
    }
  });
});
