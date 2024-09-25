import Validator from 'validator';
import { IMonthlyWagesHttpRepository } from '../repository/monthly-wages_http-repository';
import { IMonthlyWagesRepository } from '../repository/monthly-wages_repository';
import { ValidatorMonthlyWageExists } from '../validators/validatorMonthlyWageExists';

export interface IMonthlyWagesUsecase {
  createMonthlyWage(payload: any): Promise<Boolean>;
}

export default class MonthlyWagesUsecase implements IMonthlyWagesUsecase {
  constructor(
    private monthlyWagesRepository: IMonthlyWagesRepository,
    private monthlyWagesHttpRepository: IMonthlyWagesHttpRepository
  ) {}

  async createMonthlyWage(payload: any): Promise<Boolean> {
    const modelValidator = Validator.createValidatorChain([
      // validate if a monthly wage already exists
      new ValidatorMonthlyWageExists(this.monthlyWagesRepository),
    ]);
    return true;
  }
}
