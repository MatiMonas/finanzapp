import { mockUserRepository } from '__mocks__/UserRepository';
import { User } from 'users/entity';
import { UserBuilder } from 'users/entity/userBuilder';
import { UserDirector } from 'users/entity/userDirector';
import { PostUserParams } from 'users/types';
import { UserBaseData } from 'users/types/db_model';
import UserUseCase from 'users/usecase';
import { verifyPassword } from 'users/utils/functions';
import Validator from 'validator';

describe('UserUseCase', () => {
  let userUseCase: UserUseCase;

  beforeEach(() => {
    userUseCase = new UserUseCase(mockUserRepository as any);
  });

  it('should create a new user successfully', async () => {
    const mockUserData: PostUserParams = {
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
    };

    const mockValidatedUserData = { ...mockUserData, role: 'admin' };

    const mockUser: UserBaseData = {
      id: 1,
      email: 'test@example.com',
      role: 'admin',
    };

    Validator.createValidatorChain = jest.fn().mockReturnValue({
      validate: jest.fn().mockResolvedValue(mockValidatedUserData),
    });

    const mockBuilder = new UserBuilder();
    const mockDirector = new UserDirector(mockBuilder);
    mockDirector.buildUser = jest.fn().mockResolvedValue(mockUser);

    userUseCase = new UserUseCase(mockUserRepository as any);

    const result = await userUseCase.createUser(mockUserData);

    // TODO: pending repository execution and proper testing

    expect(result).toBe(true);
  });

  it('should return "ok" when calling test method', () => {
    const result = userUseCase.test();
    expect(result).toBe('ok');
  });
});
