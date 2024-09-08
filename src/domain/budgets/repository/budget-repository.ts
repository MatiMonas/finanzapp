import { PrismaClient, Budgets } from '@prisma/client';
import { DatabaseError } from 'errors';
import { CreateBudgetParams } from '../types';
import { FindBudgetConfigurationByName } from '../types/db_model';

export interface IBudgetRepository {
  createBudgetConfiguration(
    budgetConfigurationName: string,
    user_id: string
  ): Promise<number>;
  createBudget(budgetData: CreateBudgetParams[]): Promise<boolean>;
  getBudgetsByConfigurationId(configurationId: number): Promise<any>;
  findBudgetConfigurationByName(
    budgetConfigurationName: string,
    user_id: string
  ): Promise<FindBudgetConfigurationByName>;
}

export default class BudgetRepository implements IBudgetRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async createBudgetConfiguration(
    budgetConfigurationName: string,
    user_id: string
  ): Promise<number> {
    try {
      const createdBudgetConfiguration = await this.prismaClient.$transaction(
        async (prisma) => {
          return await prisma.budgetsConfigurations.create({
            data: {
              name: budgetConfigurationName,
              user_id,
            },
            select: {
              id: true,
            },
          });
        }
      );

      return createdBudgetConfiguration.id;
    } catch (error: any) {
      throw new DatabaseError('Unable to create budget configuration', {
        cause: error,
      });
    }
  }

  async createBudget(budgetData: CreateBudgetParams[]): Promise<boolean> {
    try {
      await this.prismaClient.$transaction(async (prisma) => {
        await prisma.budgets.createMany({
          data: budgetData,
        });
      });
      return true;
    } catch (error: any) {
      throw new DatabaseError('Unable to create budget', {
        cause: error,
      });
    }
  }

  async getBudgetsByConfigurationId(configurationId: number): Promise<any> {
    try {
    } catch (error) {}
  }

  async findBudgetConfigurationByName(
    budgetConfigurationName: string,
    user_id: string
  ): Promise<FindBudgetConfigurationByName> {
    try {
      const budgetConfiguration =
        await this.prismaClient.budgetsConfigurations.findFirst({
          where: {
            user_id,
            name: budgetConfigurationName,
          },
          select: {
            id: true,
            user_id: true,
            name: true,
          },
        });

      return budgetConfiguration;
    } catch (error: any) {
      throw new DatabaseError('Unable to find budget configuration by name', {
        cause: error,
      });
    }
  }
}
