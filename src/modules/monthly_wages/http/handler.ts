import { IMonthlyWagesUsecase } from '../usecase';

export interface IMonthlyWagesHandler {}

export default class MonthlyWagesHandler implements IMonthlyWagesHandler {
  protected budgetsUseCase: IMonthlyWagesUsecase;

  constructor(BudgetUsecase: IMonthlyWagesUsecase) {
    this.budgetsUseCase = BudgetUsecase;
  }
}
