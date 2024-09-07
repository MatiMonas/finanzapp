import * as bcrypt from 'bcrypt';
import { User } from 'domain/users/entity';
import * as jwt from 'jsonwebtoken';

// Mocks
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User', () => {
  const username = 'testuser';
  const email = 'testuser@example.com';
  const password = 'hashedPassword';
  const roles = [1];

  let user: User;

  beforeEach(() => {
    user = new User(username, email, password, roles);
  });

  describe('isPasswordValid', () => {
    it('should return true if the password is correct', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await user.isPasswordValid('plainPassword');

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', password);
    });

    it('should return false if the password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await user.isPasswordValid('wrongPassword');

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', password);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const mockJwtSign = jwt.sign as jest.Mock;
      const token = 'generatedToken';
      mockJwtSign.mockReturnValue(token);

      const result = user.generateToken();

      const expectedPayload = {
        username,
        email,
        roles,
      };

      expect(result).toBe(token);
      expect(mockJwtSign).toHaveBeenCalledWith(
        expectedPayload,
        expect.any(String),
        { expiresIn: '1h' }
      );
    });
  });
});
