import { Router } from 'express';
import WagesHandler, { IWagesHandler } from './handler';
import createHandler from 'infrastructure/web/createHandler';
import { STATUS_CODES } from 'utils/constants';
import { IWagesUsecase } from '../usecase';

const router = Router();

export interface IWagesRouter {
  registerRouters(): void;
  getRouter(): Router;
}

export default class WagesRouter implements IWagesRouter {
  protected wagesUsecase: IWagesUsecase;
  protected handler: IWagesHandler;

  constructor(WagesUsecase: IWagesUsecase) {
    this.wagesUsecase = WagesUsecase;
    this.handler = new WagesHandler(WagesUsecase);
    this.registerRouters();
  }

  registerRouters(): void {
    router.post(
      '/wages',
      createHandler(this.handler.createWage, STATUS_CODES.CREATED)
    );
  }

  getRouter(): Router {
    return router;
  }
}
