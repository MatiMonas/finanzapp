import Validator from 'validator';
import { IWagesRepository } from '../repository/wages_repository';
import moment from 'moment';

export class ValidatorMonthlyWageExists extends Validator {
  protected wagesRepository: IWagesRepository;

  constructor(wagesRepository: IWagesRepository) {
    super();
    this.wagesRepository = wagesRepository;
  }

  async validate(body: any): Promise<boolean> {
    const { user_id, month, year } = body;

    const month_and_year = moment(`${month}-${year}`, 'MM-YYYY').format(
      'YYYY-MM'
    );
    const monthlyWage = await this.wagesRepository.getMonthlyWageWhere({
      user_id,
      month_and_year,
    });

    console.log(monthlyWage);
    body = {
      ...body,
      month_and_year,
    };

    if (!monthlyWage) {
      body = {
        ...body,
        monthly_wage_summary_id: null,
      };

      return super.validate(body);
    }

    body = {
      ...body,
      monthly_wage_summary_id: monthlyWage.id,
    };

    return super.validate(body);
  }
}
