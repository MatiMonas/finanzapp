import UserUsecase from 'components/users/usecase';
import { mockUserRepository } from '__mocks__/User';
import { PostUserParams } from 'components/users/types';
import Validator from '../../../../validator';
import { UserBuilder } from 'components/users/entity/userBuilder';
import { UserDirector } from 'components/users/entity/userDirector';

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

      (mockUserRepository.create as jest.Mock).mockResolvedValue('user-id');

      const result = await userUseCase.create(mockUserData);

      expect(result).toBe('user-id');
    });
  });

  it('should return "ok" when calling test method', () => {
    const result = userUseCase.test();
    expect(result).toBe('ok');
  });
});
