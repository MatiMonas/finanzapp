import Validator from 'validator';
import { IMonthlyWagesHttpRepository } from '../repository/monthly_wages-http-repository';
import { IMonthlyWagesRepository } from '../repository/monthly_wages-repository';
import { ValidatorMonthlyWageExists } from '../validators/validatorMonthlyWageExists';

export interface IMonthlyWagesUsecase {
  createMonthlyWage(): Promise<Boolean>;
}

export default class MonthlyWagesUsecase implements IMonthlyWagesUsecase {
  constructor(
    private monthlyWagesRepository: IMonthlyWagesRepository,
    private monthlyWagesHttpRepository: IMonthlyWagesHttpRepository
  ) {}

  async createMonthlyWage(): Promise<Boolean> {
    const modelValidator = Validator.createValidatorChain([
      // validate if a monthly wage already exists
      new ValidatorMonthlyWageExists(this.monthlyWagesRepository),
    ]);
    return true;
  }
}
