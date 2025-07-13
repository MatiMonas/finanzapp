import { PrismaClient, Budgets } from '@prisma/client';
import { handlePrismaError } from 'utils/helpers/prismaErrorHandler';

import {
  BudgetAction,
  BudgetConfigurationParams,
  CreateBudgetPayload,
  DeleteBudgetConfigurationPayload,
  SingleUpdateBudgetAction,
  BudgetWithoutTimestamps,
  BudgetConfigurationWithBudgets,
} from '../types';

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
  ): Promise<boolean>;

  getBudgetDetails(budgetId: number): Promise<Budgets | null>;

  createBudget(budgetData: CreateBudgetPayload[]): Promise<boolean>;

  updateBudgets(budgetData: BudgetAction[]): Promise<boolean>;

  singuleUpdateBudget(budgetData: SingleUpdateBudgetAction): Promise<boolean>;

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
    } catch (error: unknown) {
      handlePrismaError(
        error,
        'Unable to find budget configurations with the specified criteria'
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
          // wage_id: true,
          user_id: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(
        error,
        'Unable to find budgets by budget configuration id'
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
          const newConfig = await prisma.budgetsConfigurations.create({
            data: {
              name: budgetConfigurationName,
              user_id,
            },
            select: {
              id: true,
            },
          });

          await prisma.users.update({
            where: { id: user_id },
            data: {
              active_budget_configuration_id: newConfig.id,
            },
          });

          return newConfig;
        }
      );

      return createdBudgetConfiguration.id;
    } catch (error: unknown) {
      handlePrismaError(error, 'Unable to create budget configuration');
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
    } catch (error: unknown) {
      handlePrismaError(error, 'Unable to update budget configuration name');
    }
  }

  async deleteBudgetConfiguration(
    budgetToDelete: DeleteBudgetConfigurationPayload
  ): Promise<boolean> {
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
    } catch (error: unknown) {
      handlePrismaError(
        error,
        `Unable to delete budget configuration with id ${budget_configuration_id}`
      );
    }
  }

  async getBudgetDetails(budgetId: number): Promise<Budgets | null> {
    try {
      return await this.prismaClient.budgets.findUnique({
        where: { id: budgetId },
        include: {
          // alerts: true,
          budget_configuration: true,
          // wage: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error, 'Unable to get budget details');
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
    } catch (error: unknown) {
      handlePrismaError(error, 'Unable to create budget');
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
    } catch (error: unknown) {
      handlePrismaError(error, 'Unable to update budgets');
    }
  }

  async singuleUpdateBudget(
    budgetData: SingleUpdateBudgetAction
  ): Promise<boolean> {
    try {
      await this.prismaClient.$transaction(async (prisma) => {
        await prisma.budgets.update({
          where: { id: budgetData.id },
          data: {
            remaining_allocation: budgetData.remaining_allocation,
            updated_at: budgetData.updated_at,
            monthly_wage_summary_id: budgetData.monthly_wage_summary_id,
          },
        });
      });
      return true;
    } catch (error: unknown) {
      handlePrismaError(error, 'Unable to update budgets');
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
    } catch (error: unknown) {
      handlePrismaError(error, 'Unable to delete budgets');
    }
  }
}
