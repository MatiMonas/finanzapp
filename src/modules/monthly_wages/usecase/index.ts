import { IMonthlyWagesHttpRepository } from '../repository/monthly_wages-http-repository';
import { IMonthlyWagesRepository } from '../repository/monthly_wages-repository';

export interface IMonthlyWagesUsecase {}

export default class MonthlyWagesUsecase implements IMonthlyWagesUsecase {
  constructor(
    private monthlyWagesRepository: IMonthlyWagesRepository,
    private monthlyWagesHttpRepository: IMonthlyWagesHttpRepository
  ) {}
}
