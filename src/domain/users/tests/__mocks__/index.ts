import UserRepository from 'domain/users/repository/user-repository';
import UserUsecase from 'domain/users/usecase';

export const mockUserUseCase = {
  test: jest.fn().mockResolvedValue('ok'),
  create: jest.fn(),
} as unknown as UserUsecase;

export const mockUserRepository = {
  findUserById: jest.fn(),
  findUserByEmail: jest.fn(),
  create: jest.fn(),
} as unknown as UserRepository;
