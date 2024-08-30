import { PrismaClient } from '@prisma/client';

export default class UserRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async getUser(userEmail: string) {
    const foundUser = await this.prismaClient.users.findUnique({
      where: {
        email: userEmail,
      },
    });
    return foundUser;
  }
}
