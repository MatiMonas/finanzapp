import { Request, Response } from 'express';
import { PostUserParams } from 'users/types';
import UserUseCase from 'users/usecase';
import UsersHandler from 'users/http/handler';

// Crear mocks para UserUseCase
const mockUserUseCase = {
  test: jest.fn(),
  create: jest.fn(),
} as unknown as UserUseCase;

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
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
    };

    (mockUserUseCase.create as jest.Mock).mockResolvedValue(true);

    const req = {
      body: mockUserData,
    } as Request<any, any, any, PostUserParams>;
    const res = {} as Response;
    res.json = jest.fn();

    await usersHandler.post(req);

    expect(mockUserUseCase.create).toHaveBeenCalledWith(mockUserData);
  });
});
