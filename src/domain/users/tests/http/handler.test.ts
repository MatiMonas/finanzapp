import UsersHandler from 'domain/users/http/handler';
import { PostUserParams } from 'domain/users/types';
import UserUsecase from 'domain/users/usecase';
import { Request, Response } from 'express';

// Crear mocks para UserUseCase
const mockUserUseCase = {
  test: jest.fn(),
  create: jest.fn(),
} as unknown as UserUsecase;

const usersHandler = new UsersHandler(mockUserUseCase);

describe('UsersHandler', () => {
  it('should call test method of UserUseCase', async () => {
    (mockUserUseCase.test as jest.Mock).mockResolvedValue('test result');

    const req = {} as Request;
    const res = {} as Response;
    res.json = jest.fn();

    usersHandler.test(req);

    expect(mockUserUseCase.test).toHaveBeenCalled();
  });

  it('should call create method of UserUseCase with correct data', async () => {
    const mockUserData: PostUserParams = {
      username: 'test',
      email: 'test@example.com',
      password: 'password123',
      roles: [1],
    };

    (mockUserUseCase.create as jest.Mock).mockResolvedValue(true);

    const req = {
      body: mockUserData,
    } as Request<any, any, any, PostUserParams>;
    const res = {} as Response;
    res.json = jest.fn();

    await usersHandler.create(req);

    expect(mockUserUseCase.create).toHaveBeenCalledWith(mockUserData);
  });
});