import { PrismaClient, Wages } from '@prisma/client';
import { handlePrismaError } from 'utils/helpers/prismaErrorHandler';

import { WagesParams, MonthlyWageSummary, Wage } from '../types';

export interface IWagesRepository {
  getWagesWhere(where: WagesParams): Promise<Wages | null>;
  getMonthlyWageWhere(
    where: MonthlyWageSummary
  ): Promise<MonthlyWageSummary | null>;
  createWage(data: Wage): Promise<Wages>;
  createMonthlyWage(data: MonthlyWageSummary): Promise<MonthlyWageSummary>;
  updateMonthlyWageSummary(
    monthlyWageSummaryId: number,
    amountToAdd: number
  ): Promise<MonthlyWageSummary>;
}

export default class WagesRepository implements IWagesRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async getMonthlyWageWhere(
    where: MonthlyWageSummary
  ): Promise<MonthlyWageSummary | null> {
    try {
      return await this.prismaClient.monthlyWageSummary.findFirst({
        where: {
          ...where,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error, 'Error finding monthly wage');
    }
  }
  async getWagesWhere(where: WagesParams): Promise<Wages | null> {
    try {
      return await this.prismaClient.wages.findFirst({
        where: {
          ...where,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error, 'Error finding wage');
    }
  }

  async createWage(data: Wage): Promise<Wages> {
    try {
      const wage = await this.prismaClient.wages.create({
        data,
      });

      return wage;
    } catch (error: unknown) {
      handlePrismaError(error, 'Error creating wage');
    }
  }

  async createMonthlyWage(
    data: MonthlyWageSummary
  ): Promise<MonthlyWageSummary> {
    try {
      const monthlyWage = await this.prismaClient.monthlyWageSummary.create({
        data: {
          user_id: data.user_id,
          month_and_year: data.month_and_year,
          total_wage: data.total_wage as number,
          remaining: data.remaining as number,
        },
      });

      return monthlyWage;
    } catch (error: unknown) {
      handlePrismaError(error, 'Error creating monthly wage');
    }
  }

  async updateMonthlyWageSummary(
    monthlyWageSummaryId: number,
    amountToAdd: number
  ): Promise<MonthlyWageSummary> {
    try {
      const updated = await this.prismaClient.monthlyWageSummary.update({
        where: { id: monthlyWageSummaryId },
        data: {
          total_wage: {
            increment: amountToAdd,
          },
          remaining: {
            increment: amountToAdd,
          },
        },
      });

      return updated;
    } catch (error: unknown) {
      handlePrismaError(error, 'Error updating monthly wage summary');
    }
  }
}
