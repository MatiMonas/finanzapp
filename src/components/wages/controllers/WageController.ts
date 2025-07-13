import { Controller, Post, Body, Route, Tags, SuccessResponse } from 'tsoa';

import { WageBody, WageResponse } from '../types';
import container from '../../../container';

@Route('wages')
@Tags('Wages')
export class WageController extends Controller {
  private wagesUsecase;

  constructor(wagesUsecase = container.wagesUsecase) {
    super();
    this.wagesUsecase = wagesUsecase;
  }

  /**
   * Create a new wage record for a user in a specific month and year
   * @param wageData Wage data including user_id, amount, month, year and currency
   */
  @Post()
  @SuccessResponse('201', 'Created')
  public async createWage(@Body() wageData: WageBody): Promise<WageResponse> {
    const result = await this.wagesUsecase.createWage(wageData);
    this.setStatus(201);
    return {
      success: Boolean(result),
      message: result ? 'Wage created successfully' : 'Failed to create wage',
    };
  }
}
