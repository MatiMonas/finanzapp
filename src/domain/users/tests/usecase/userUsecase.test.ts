import UserUsecase from 'domain/users/usecase';
import { mockUserRepository } from '../__mocks__';
import { PostUserParams } from 'domain/users/types';
import Validator from 'validator';
import { UserBuilder } from 'domain/users/entity/userBuilder';
import { UserDirector } from 'domain/users/entity/userDirector';

describe('UserUseCase', () => {
  let userUseCase: UserUsecase;

  beforeEach(() => {
    userUseCase = new UserUsecase(mockUserRepository as any);
  });

  describe('create', () => {
    it('OK - should return true if user was succesfully created', async () => {
      const mockUserData: PostUserParams = {
        username: 'test',
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

      userUseCase = new UserUsecase(mockUserRepository as any);

      (mockUserRepository.create as jest.Mock).mockResolvedValue(true);

      const result = await userUseCase.create(mockUserData);

      expect(result).toBe(true);
    });

    it('OK - should return false if user was not created', async () => {
      const mockUserData: PostUserParams = {
        username: 'test',
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

      userUseCase = new UserUsecase(mockUserRepository as any);

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