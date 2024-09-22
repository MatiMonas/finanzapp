import { PrismaClient } from '@prisma/client';

export interface IMonthlyWagesRepository {
  findMonthlyWageByMonth(month: Date): Promise<any>;
  create(): Promise<any>;
}

export default class MonthlyWagesRepository implements IMonthlyWagesRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findMonthlyWageByMonth(month: Date): Promise<any> {
    return true;
  }
  async create(): Promise<any> {
    return true;
  }
}
