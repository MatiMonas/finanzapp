import { Wages, PrismaClient } from '@prisma/client';
import { DatabaseError } from 'errors';
import { WageBody, WagesParams } from '../types/request';
import moment from 'moment';
import { Wage } from '../types/db_model';

export interface IWagesRepository {
  getWagesWhere(where: WagesParams): Promise<Wages | null>;
  createWage(data: Wage): Promise<any>;
}

export default class WagesRepository implements IWagesRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
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
        data: {
          user_id: data.user_id,
          amount: data.amount,
          exchange_rate: data.exchange_rate,
          month_and_year: data.month_and_year,
          currency: data.currency,
          monthly_wage_summary_id: data.monthly_wage_summary_id,
        },
      });

      return wage;
    } catch (error) {
      throw new DatabaseError('Error creating wage');
    }
  }
}
