import { IMonthlyWagesRepository } from '../repository/monthly_wages-repository';

export interface IMonthlyWagesUsecase {}

export default class MonthlyWagesUsecase implements IMonthlyWagesUsecase {
  constructor(private monthlyWagesRepository: IMonthlyWagesRepository) {}
}
