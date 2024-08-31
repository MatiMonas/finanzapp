import { PrismaClient } from '@prisma/client';
import { UserBaseData } from 'users/types/db_model';
import { IUserRepository } from './IUserRepository';

export default class UserRepository implements IUserRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findUserByEmail(userEmail: string): Promise<UserBaseData | null> {
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
