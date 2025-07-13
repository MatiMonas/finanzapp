import { describe, it, expect, beforeEach } from 'bun:test';
import * as bcrypt from 'bcrypt';
import { User } from 'components/users/entity';

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
      const result = await user.isPasswordValid('plainPassword');

      expect(typeof result).toBe('boolean');
    });

    it('should return false if the password is incorrect', async () => {
      const result = await user.isPasswordValid('wrongPassword');

      expect(typeof result).toBe('boolean');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const result = user.generateToken();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      expect(result.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });
});
