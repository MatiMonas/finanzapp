import Validator from 'validator';
import { IMonthlyWagesRepository } from '../repository/monthly-wages_repository';

export class ValidatorMonthlyWageExists extends Validator {
  constructor(private monthlyWagesRepository: IMonthlyWagesRepository) {
    super();
  }

  async validate(body: any) {
    return super.validate(body);
  }
}
