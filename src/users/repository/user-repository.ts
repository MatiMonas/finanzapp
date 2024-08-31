import { PrismaClient } from '@prisma/client';
import { FindUserByEmail } from 'users/types/db_model';

export default class UserRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findUserByEmail(userEmail: string): Promise<FindUserByEmail | null> {
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
