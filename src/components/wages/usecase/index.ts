import Validator from 'validator';
import { IWagesHttpRepository } from '../repository/wages_http-repository';
import { IWagesRepository } from '../repository/wages_repository';
import { WageBody } from '../types/request';
import { ValidatorMonthlyWageExists } from '../validators/validatorMonthlyWageExists';
import moment from 'moment';
import { Wage } from '../types/db_model';
import { Wages } from '@prisma/client';

export interface IWagesUsecase {
  createWage(payload: any): Promise<Boolean>;
}

export default class WagesUsecase implements IWagesUsecase {
  constructor(
    private wagesRepository: IWagesRepository,
    private wagesHttpRepository: IWagesHttpRepository
  ) {}

  async createWage(payload: WageBody): Promise<Boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorMonthlyWageExists(this.wagesRepository),
    ]);

    // Data ya viene con month_and_year y monthly_wage_summary_id
    const data = modelValidator.validate(payload);

    // Se necesita verificar si existe un monthly wage para el mes y año, en caso que no exista se debe crear.
    // En caso de existir se debe actualizar el wage (updateWage func)
    let monthlyWageSummary;
    if (!data.monthly_wage_summary_id) {
      // Create monthly wage
    }

    // Se necesita chequear el currency que subio el usuario para poder convertirlo y hacer la suma general en el monthlyWage
    //

    return true;
  }

  // TODO: updateWage
}
