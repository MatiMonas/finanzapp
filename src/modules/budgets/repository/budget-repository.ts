import { PrismaClient, Budgets } from '@prisma/client';
import { DatabaseError } from 'errors';
import {
  BudgetAction,
  CreateBudgetPayload,
  DeleteBudgetPayload,
} from '../types/request';
import {
  BudgetWithoutTimestamps,
  FindBudgetConfigurationByName,
} from '../types/db_model';

export interface IBudgetRepository {
  createBudgetConfiguration(
    budgetConfigurationName: string,
    user_id: string
  ): Promise<number>;
  deleteBudgetConfiguration(
    budgetToDelete: DeleteBudgetPayload
  ): Promise<Boolean>;
  createBudget(budgetData: CreateBudgetPayload[]): Promise<boolean>;
  updateBudgetConfigurationName(
    budgetConfigurationId: number,
    newName: string
  ): Promise<boolean>;
  updateBudgets(budgetData: BudgetAction[]): Promise<boolean>;
  deleteBudgets(budgetIds: number[]): Promise<boolean>;
  getBudgetsByConfigurationId(
    configurationId: number
  ): Promise<BudgetWithoutTimestamps[]>;
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

  async createBudget(budgetData: CreateBudgetPayload[]): Promise<boolean> {
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

  async updateBudgetConfigurationName(
    budgetConfigurationId: number,
    newName: string
  ): Promise<boolean> {
    try {
      await this.prismaClient.$transaction(async (prisma) => {
        await prisma.budgetsConfigurations.update({
          where: { id: budgetConfigurationId },
          data: { name: newName },
        });
      });
      return true;
    } catch (error: any) {
      throw new DatabaseError('Unable to update budget configuration name', {
        cause: error,
      });
    }
  }

  async deleteBudgets(budgetIds: number[]): Promise<boolean> {
    try {
      await this.prismaClient.$transaction(async (prisma) => {
        await prisma.budgets.deleteMany({
          where: {
            id: { in: budgetIds },
          },
        });
      });
      return true;
    } catch (error: any) {
      throw new DatabaseError('Unable to delete budgets', { cause: error });
    }
  }

  async updateBudgets(budgetData: BudgetAction[]): Promise<boolean> {
    try {
      await this.prismaClient.$transaction(async (prisma) => {
        for (const budget of budgetData) {
          await prisma.budgets.update({
            where: { id: budget.id },
            data: {
              name: budget.name || undefined,
              percentage: budget.percentage || undefined,
            },
          });
        }
      });
      return true;
    } catch (error: any) {
      throw new DatabaseError('Unable to update budgets', { cause: error });
    }
  }

  async getBudgetsByConfigurationId(
    configurationId: number
  ): Promise<BudgetWithoutTimestamps[]> {
    try {
      return await this.prismaClient.budgets.findMany({
        where: {
          budget_configuration_id: configurationId,
        },
        select: {
          id: true,
          name: true,
          percentage: true,
          remaining_allocation: true,
          budget_configuration_id: true,
          transfer_to_budget_id: true,
          monthly_wage_id: true,
          user_id: true,
        },
      });
    } catch (error: any) {
      throw new DatabaseError(
        'Unable to find budgets by budget configuration id',
        {
          cause: error,
        }
      );
    }
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

  async deleteBudgetConfiguration(
    budgetToDelete: DeleteBudgetPayload
  ): Promise<Boolean> {
    const { user_id, budget_configuration_id } = budgetToDelete;
    try {
      return await this.prismaClient.$transaction(async (prisma) => {
        await prisma.budgetsConfigurations.deleteMany({
          where: {
            id: budget_configuration_id,
            user_id: user_id,
          },
        });
        return true;
      });
    } catch (error: any) {
      throw new DatabaseError(
        `Unable to delete budget configuration with id ${budget_configuration_id}`,
        { cause: error }
      );
    }
  }
}
