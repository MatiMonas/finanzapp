import { PrismaClient, Budgets } from '@prisma/client';
import { DatabaseError } from 'errors';

export interface IBudgetRepository {
  createBudgetConfiguration(
    budgetConfigurationName: string,
    user_id: string
  ): Promise<boolean>;
  createBudget(budgetData: any): Promise<boolean>;
  getBudgetsByConfigurationId(configurationId: number): Promise<any>;
}

export default class BudgetRepository implements IBudgetRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async createBudgetConfiguration(
    budgetConfigurationName: string,
    user_id: string
  ): Promise<boolean> {
    try {
      await this.prismaClient.$transaction(async (prisma) => {
        await prisma.budgetsConfigurations.create({
          data: {
            name: budgetConfigurationName,
            total_percentage: 0,
            user_id,
          },
        });
      });
      return true;
    } catch (error: any) {
      throw new DatabaseError('Unable to create budget configuration', {
        cause: error,
      });
    }
  }

  async createBudget(budgetData: any): Promise<boolean> {
    return true;
  }

  async getBudgetsByConfigurationId(configurationId: number): Promise<any> {
    try {
    } catch (error) {}
  }
}
