import Validator from 'validator';
import { IWagesHttpRepository } from '../repository/wages_http-repository';
import { IWagesRepository } from '../repository/wages_repository';
import { WageBody } from '../types/request';

export interface IWagesUsecase {
  createWage(payload: any): Promise<Boolean>;
}

export default class WagesUsecase implements IWagesUsecase {
  constructor(
    private wagesRepository: IWagesRepository,
    private wagesHttpRepository: IWagesHttpRepository
  ) {}

  async createWage(payload: WageBody): Promise<Boolean> {
    // const modelValidator = Validator.createValidatorChain([]);
    return true;
  }

  // TODO: updateWage
}
