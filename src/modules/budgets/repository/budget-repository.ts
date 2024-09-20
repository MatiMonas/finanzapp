import { PrismaClient, Budgets, BudgetsConfigurations } from '@prisma/client';
import { DatabaseError } from 'errors';
import {
  BudgetAction,
  BudgetConfigurationParams,
  CreateBudgetPayload,
  DeleteBudgetConfigurationPayload,
} from '../types/request';
import {
  BudgetConfigurationWithBudgets,
  BudgetWithoutTimestamps,
} from '../types/db_model';
import moment from 'moment';

export interface IBudgetRepository {
  findBudgetConfigurationWhere(
    where: BudgetConfigurationParams
  ): Promise<BudgetConfigurationWithBudgets[]>;

  getBudgetsByConfigurationId(
    configurationId: number
  ): Promise<BudgetWithoutTimestamps[]>;

  createBudgetConfiguration(
    budgetConfigurationName: string,
    user_id: string
  ): Promise<number>;

  updateBudgetConfigurationName(
    budgetConfigurationId: number,
    newName: string
  ): Promise<boolean>;

  deleteBudgetConfiguration(
    budgetToDelete: DeleteBudgetConfigurationPayload
  ): Promise<Boolean>;

  getBudgetDetails(budgetId: number): Promise<Budgets | null>;

  createBudget(budgetData: CreateBudgetPayload[]): Promise<boolean>;

  updateBudgets(budgetData: BudgetAction[]): Promise<boolean>;

  deleteBudgets(budgetIds: number[]): Promise<boolean>;
}
export default class BudgetRepository implements IBudgetRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findBudgetConfigurationWhere(
    where: BudgetConfigurationParams
  ): Promise<BudgetConfigurationWithBudgets[]> {
    try {
      return await this.prismaClient.budgetsConfigurations.findMany({
        where: {
          deleted_at: null,
          ...where,
        },
        include: {
          budgets: true,
        },
      });
    } catch (error: any) {
      throw new DatabaseError(
        'Unable to find budget configurations with the specified criteria',
        { cause: error }
      );
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

  async deleteBudgetConfiguration(
    budgetToDelete: DeleteBudgetConfigurationPayload
  ): Promise<Boolean> {
    const { user_id, budget_configuration_id } = budgetToDelete;
    try {
      return await this.prismaClient.$transaction(async (prisma) => {
        await prisma.budgets.updateMany({
          where: {
            budget_configuration_id,
          },
          data: {
            deleted_at: new Date(),
          },
        });

        await prisma.budgetsConfigurations.updateMany({
          where: {
            id: budget_configuration_id,
            user_id: user_id,
          },
          data: {
            deleted_at: new Date(),
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

  async getBudgetDetails(budgetId: number): Promise<Budgets | null> {
    try {
      return await this.prismaClient.budgets.findUnique({
        where: { id: budgetId },
        include: {
          alerts: true,
          budget_configuration: true,
          monthly_wage: true,
        },
      });
    } catch (error: any) {
      throw new DatabaseError('Unable to get budget details', {
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
}
