import { PostUserParams } from 'users/types';

export interface IUserUseCase {
  createUser(userData: PostUserParams): Promise<Boolean>;
  test(): string;
}
