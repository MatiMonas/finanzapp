import { Wages, PrismaClient } from '@prisma/client';
import { DatabaseError } from 'errors';
import { WagesParams } from '../types/request';

export interface IWagesRepository {
  getWagesWhere(where: WagesParams): Promise<Wages | null>;
  createWage(): Promise<any>;
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
      throw new DatabaseError('Error finding  wage');
    }
  }
  async createWage(): Promise<any> {
    return true;
  }
}
