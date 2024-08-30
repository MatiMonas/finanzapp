import { PrismaClient } from '@prisma/client';

export default class UserRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }
}
