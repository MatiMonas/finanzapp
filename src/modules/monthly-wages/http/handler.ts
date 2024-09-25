import { Request } from 'express';
import { IMonthlyWagesUsecase } from '../usecase';

export interface IMonthlyWagesHandler {
  createMonthlyWage(req: Request<any, any, any, any>): Promise<Boolean>;
}

export default class MonthlyWagesHandler implements IMonthlyWagesHandler {
  constructor(private monthlyWagesUsecase: IMonthlyWagesUsecase) {}

  createMonthlyWage = (req: Request<any, any, any, any>): Promise<Boolean> => {
    return this.monthlyWagesUsecase.createMonthlyWage(req.body);
  };
}
