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

    const month_and_year = moment(`${month}-${year}`, 'MM-YYYY').toString();
    const wage = await this.wagesRepository.getWagesWhere({
      user_id,
      month_and_year,
    });

    body = {
      ...body,
      month_and_year,
    };

    if (!wage) {
      body = {
        ...body,
        monthly_wage_summary_id: null,
      };

      return super.validate(body);
    }

    body = {
      ...body,
      monthly_wage_summary_id: wage.monthly_wage_summary_id,
    };

    return super.validate(body);
  }
}
