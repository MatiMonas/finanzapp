import { PrismaClient } from '@prisma/client';

export interface IMonthlyWagesRepository {
  create(): Promise<any>;
}

export default class MonthlyWagesRepository implements IMonthlyWagesRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async create(): Promise<any> {
    return true;
  }
}
