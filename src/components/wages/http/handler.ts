import { Request } from 'express';
import { IWagesUsecase } from '../usecase';
import { WageBody } from '../types/request';

export interface IWagesHandler {
  createWage(req: Request<any, any, any, any>): Promise<Boolean>;
}

export default class WagesHandler implements IWagesHandler {
  constructor(private wagesUsecase: IWagesUsecase) {}

  createWage = (req: Request<any, any, any, WageBody>): Promise<Boolean> => {
    return this.wagesUsecase.createWage(req.body);
  };
}
