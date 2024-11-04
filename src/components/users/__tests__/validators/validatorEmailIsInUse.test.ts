import UserRepository from 'components/users/repository/user-repository';
import { ValidatorEmailIsInUse } from 'components/users/validators/validatorEmailIsInUse';
import { EmailAlreadyInUseError } from 'errors';
import { STATUS_CODES, ERROR_CODES, ERROR_NAMES } from 'utils/constants';

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
    const userResponse = { email: 'test@example.com' };

    userRepository.findUserByEmail.mockResolvedValueOnce(userResponse);

    const body = {
      email: 'test@example.com',
    };

    try {
      await validator.validate(body);
    } catch (error: any) {
      expect(error).toBeInstanceOf(EmailAlreadyInUseError);
      expect(error.statusCode).toBe(STATUS_CODES.CONFLICT);
      expect(error.code).toBe(ERROR_CODES.EMAIL_ALREADY_IN_USE);
      expect(error.name).toBe(ERROR_NAMES.EMAIL_ALREADY_IN_USE);
      expect(error.message).toBe('Email address already in use.');
    }
  });
});
