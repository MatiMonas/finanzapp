import { mockUserRepository } from 'users/tests/__mocks__';
import { UserBuilder } from 'users/entity/userBuilder';
import { UserDirector } from 'users/entity/userDirector';
import { PostUserParams } from 'users/types';
import { FindByUserEmailRequestData } from 'users/types/db_model';
import UserUseCase from 'users/usecase';
import Validator from 'validator';

describe('UserUseCase', () => {
  let userUseCase: UserUseCase;

  beforeEach(() => {
    userUseCase = new UserUseCase(mockUserRepository as any);
  });

  describe('create', () => {
    it('OK - should return true if user was succesfully created', async () => {
      const mockUserData: PostUserParams = {
        email: 'test@example.com',
        password: 'password123',
        roles: [1],
      };

      const mockValidatedUserData = { ...mockUserData };

      Validator.createValidatorChain = jest.fn().mockReturnValue({
        validate: jest.fn().mockResolvedValue(mockValidatedUserData),
      });

      const mockBuilder = new UserBuilder();
      const mockDirector = new UserDirector(mockBuilder);
      mockDirector.buildUser = jest
        .fn()
        .mockResolvedValue({ ...mockUserData, password: 'hashedpassword' });

      userUseCase = new UserUseCase(mockUserRepository as any);

      (mockUserRepository.create as jest.Mock).mockResolvedValue(true);

      const result = await userUseCase.create(mockUserData);

      expect(result).toBe(true);
    });

    it('OK - should return false if user was not created', async () => {
      const mockUserData: PostUserParams = {
        email: 'test@example.com',
        password: 'password123',
        roles: [1],
      };

      const mockValidatedUserData = { ...mockUserData };

      Validator.createValidatorChain = jest.fn().mockReturnValue({
        validate: jest.fn().mockResolvedValue(mockValidatedUserData),
      });

      const mockBuilder = new UserBuilder();
      const mockDirector = new UserDirector(mockBuilder);
      mockDirector.buildUser = jest
        .fn()
        .mockResolvedValue({ ...mockUserData, password: 'hashedpassword' });

      userUseCase = new UserUseCase(mockUserRepository as any);

      (mockUserRepository.create as jest.Mock).mockResolvedValue(false);

      const result = await userUseCase.create(mockUserData);

      expect(result).toBe(false);
    });
  });

  it('should return "ok" when calling test method', () => {
    const result = userUseCase.test();
    expect(result).toBe('ok');
  });
});
