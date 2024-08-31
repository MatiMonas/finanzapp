import { PrismaClient } from '@prisma/client';
import { FindByUserEmailRequestData } from 'users/types/db_model';
import { IUserRepository } from './IUserRepository';
import { PostUserParams } from 'users/types';
import { DatabaseError } from 'errors';

export default class UserRepository implements IUserRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findUserByEmail(
    userEmail: string
  ): Promise<FindByUserEmailRequestData | null> {
    try {
      const foundUser = await this.prismaClient.users.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
      return foundUser;
    } catch (error: any) {
      throw new DatabaseError('Unable to find user by email', { cause: error });
    }
  }

  async create(userData: PostUserParams): Promise<boolean> {
    try {
      await this.prismaClient.users.create({ data: userData });
      return true;
    } catch (error: any) {
      throw new DatabaseError('Unable to create user', { cause: error });
    }
  }
}
