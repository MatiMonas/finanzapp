import { PrismaClient, Budgets } from '@prisma/client';
import { DatabaseError } from 'errors';

export interface IBudgetRepository {
  create(budgetData: any): Promise<boolean>;
}

export default class BudgetRepository implements IBudgetRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async create(budgetData: any): Promise<boolean> {
    return true;
  }
}
