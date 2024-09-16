import { mockUserUseCase } from '__mocks__/User';
import UsersHandler from 'modules/users/http/handler';
import { PostUserParams } from 'modules/users/types';
import { Request, Response } from 'express';

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
