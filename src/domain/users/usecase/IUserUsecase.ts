import { PostUserParams } from 'users/types';

export interface IUserUseCase {
  create(userData: PostUserParams): Promise<Boolean>;
  test(): string;
}
