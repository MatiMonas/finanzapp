import { Wages, PrismaClient } from '@prisma/client';
import { DatabaseError } from 'errors';
import { WagesParams } from '../types/request';

import { MonthlyWageSummary, Wage } from '../types/db_model';

export interface IWagesRepository {
  getWagesWhere(where: WagesParams): Promise<Wages | null>;
  getMonthlyWageWhere(
    where: MonthlyWageSummary
  ): Promise<MonthlyWageSummary | null>;
  createWage(data: Wage): Promise<any>;
  createMonthlyWage(data: MonthlyWageSummary): Promise<any>;
  updateMonthlyWageSummary(
    monthlyWageSummaryId: number,
    amountToAdd: number
  ): Promise<any>;
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
    } catch (error) {
      throw new DatabaseError('Error finding monthly wage');
    }
  }
  async getWagesWhere(where: WagesParams): Promise<Wages | null> {
    try {
      return await this.prismaClient.wages.findFirst({
        where: {
          ...where,
        },
      });
    } catch (error) {
      throw new DatabaseError('Error finding wage');
    }
  }

  async createWage(data: Wage): Promise<any> {
    try {
      const wage = await this.prismaClient.wages.create({
        data,
      });

      return wage;
    } catch (error) {
      throw new DatabaseError('Error creating wage');
    }
  }

  async createMonthlyWage(data: MonthlyWageSummary): Promise<any> {
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
    } catch (error) {
      throw new DatabaseError('Error creating monthly wage');
    }
  }

  async updateMonthlyWageSummary(
    monthlyWageSummaryId: number,
    amountToAdd: number
  ): Promise<any> {
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
    } catch (error) {
      throw new DatabaseError('Error updating monthly wage summary');
    }
  }
}
