import { Request } from 'express';
import { IMonthlyWagesUsecase } from '../usecase';

export interface IMonthlyWagesHandler {
  create(req: Request<any, any, any, any>): Promise<Boolean>;
}

export default class MonthlyWagesHandler implements IMonthlyWagesHandler {
  protected monthlyWagesUsecase: IMonthlyWagesUsecase;

  constructor(MonthlyWagesUsecase: IMonthlyWagesUsecase) {
    this.monthlyWagesUsecase = MonthlyWagesUsecase;
  }

  async create(): Promise<Boolean> {
    return this.monthlyWagesUsecase.createMonthlyWage();
  }
}
