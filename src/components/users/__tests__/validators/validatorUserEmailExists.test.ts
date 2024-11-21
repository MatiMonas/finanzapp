import { mockUserRepository } from '__mocks__/User';
import { ValidatorUserEmailExists } from 'components/users/validators/validatorUserEmailExists';
import { UserNotFoundError } from 'errors';

describe('ValidatorUserEmailExists', () => {
  let validator: ValidatorUserEmailExists;

  beforeEach(() => {
    validator = new ValidatorUserEmailExists(mockUserRepository);
  });

  it('should pass validation if user with the email exists', async () => {
    // Simula que el usuario existe en el repositorio
    (mockUserRepository.findUserByEmail as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'existing@example.com',
      password: 'hashedpassword',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const body = { email: 'existing@example.com' };
    await expect(validator.validate(body)).resolves.not.toThrow();

    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
      'existing@example.com'
    );
  });

  it('should throw UserNotFoundError if user with the email does not exist', async () => {
    (mockUserRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

    const body = { email: 'nonexistent@example.com' };

    await expect(validator.validate(body)).rejects.toThrow(UserNotFoundError);
    await expect(validator.validate(body)).rejects.toThrow(
      'User with email "nonexistent@example.com" not found.'
    );

    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
      'nonexistent@example.com'
    );
  });
});
