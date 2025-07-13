import moment from 'moment';

import Validator from '../../../validator';
import { IWagesRepository } from '../repository/wages_repository';
import { WageBodyWithMetadata } from '../types';

export class ValidatorMonthlyWageExists extends Validator {
  protected wagesRepository: IWagesRepository;

  constructor(wagesRepository: IWagesRepository) {
    super();
    this.wagesRepository = wagesRepository;
  }

  async validate(body: WageBodyWithMetadata): Promise<WageBodyWithMetadata> {
    const { user_id, month, year } = body;

    const month_and_year = moment(`${month}-${year}`, 'MM-YYYY').format(
      'YYYY-MM'
    );
    const monthlyWage = await this.wagesRepository.getMonthlyWageWhere({
      user_id,
      month_and_year,
    });

    (body as WageBodyWithMetadata).month_and_year = month_and_year;

    if (!monthlyWage) {
      (body as WageBodyWithMetadata).monthly_wage_summary_id = null;
      return super.validate(body) as WageBodyWithMetadata;
    }

    (body as WageBodyWithMetadata).monthly_wage_summary_id = monthlyWage.id;
    return super.validate(body) as WageBodyWithMetadata;
  }
}
