import { FindByUserEmailRequestData } from 'users/types/db_model';

export interface IUserRepository {
  findUserByEmail(
    userEmail: string
  ): Promise<FindByUserEmailRequestData | null>;
}
