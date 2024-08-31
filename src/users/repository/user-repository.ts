import { PrismaClient } from '@prisma/client';
import { FindByUserEmailRequestData } from 'users/types/db_model';
import { IUserRepository } from './IUserRepository';

export default class UserRepository implements IUserRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findUserByEmail(
    userEmail: string
  ): Promise<FindByUserEmailRequestData | null> {
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
  }
}
