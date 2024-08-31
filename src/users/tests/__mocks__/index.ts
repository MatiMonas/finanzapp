import UserRepository from 'users/repository/user-repository';
import UserUseCase from 'users/usecase';

export const mockUserUseCase = {
  test: jest.fn().mockResolvedValue('ok'),
  create: jest.fn(),
} as unknown as UserUseCase;

export const mockUserRepository = {
  findUserByEmail: jest.fn(),
  create: jest.fn(),
} as unknown as UserRepository;
