import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import UserUsecase from 'components/users/usecase';
import { createMockUserRepository } from '__mocks__/User';
import { PostUserParams } from 'components/users/types';
import { createMockFn } from '__mocks__/testHelpers';
import { UserDirector } from 'components/users/entity/userDirector';
import { User } from 'components/users/entity';

const mockUser = new User('testuser', 'test@example.com', 'hashedpassword', [
  1,
]);

describe('UserUseCase', () => {
  let userUseCase: UserUsecase;
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let originalBuildUser: any;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    userUseCase = new UserUsecase(mockUserRepository);

    originalBuildUser = UserDirector.prototype.buildUser;
    UserDirector.prototype.buildUser = createMockFn(() =>
      Promise.resolve(mockUser)
    );
  });

  afterEach(() => {
    UserDirector.prototype.buildUser = originalBuildUser;
  });

  it('OK - should return true if user was succesfully created', async () => {
    const mockUserData: PostUserParams = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPass123!',
      roles: [1],
    };

    mockUserRepository.create = createMockFn(() => Promise.resolve('user-id'));

    const result = await userUseCase.create(mockUserData);

    expect(result).toBe('user-id');
  });

  it('should return "ok" when calling test method', () => {
    const result = userUseCase.test();
    expect(result).toBe('ok');
  });
});
