import { IBudgetRepository } from 'components/budgets/repository/budget-repository';
import { MissingMonthlyWageSummaryIdError } from 'errors';

import Validator from '../../../validator';
import { IWagesHttpRepository } from '../repository/wages_http-repository';
import { IWagesRepository } from '../repository/wages_repository';
import { WageBody } from '../types';
import { ValidatorMonthlyWageExists } from '../validators/validatorMonthlyWageExists';

export interface IWagesUsecase {
  createWage(payload: WageBody): Promise<boolean>;
}

export default class WagesUsecase implements IWagesUsecase {
  constructor(
    private wagesRepository: IWagesRepository,
    private wagesHttpRepository: IWagesHttpRepository,
    private budgetsRepository: IBudgetRepository
  ) {}

  async createWage(payload: WageBody): Promise<boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorMonthlyWageExists(this.wagesRepository),
    ]);

    const data = (await modelValidator.validate(payload)) as WageBody & {
      month_and_year: string;
      monthly_wage_summary_id?: number | null;
    };

    const updatedData = await this.handleMonthlyWageSummary(data);

    const { amountInUSD, amountInARS, exchangeRate } =
      await this.calculateAmounts(updatedData.amount, updatedData.currency);

    await this.wagesRepository.createWage({
      user_id: data.user_id,
      amount: data.amount,
      currency: data.currency,
      month_and_year: data.month_and_year,
      exchange_rate: exchangeRate,
      monthly_wage_summary_id: data.monthly_wage_summary_id as number,
      amount_in_usd: amountInUSD,
      amount_in_ars: amountInARS,
    });

    await this.updateBudgetsAllocations(
      updatedData.user_id,
      updatedData.amount,
      updatedData.monthly_wage_summary_id!
    );

    return true;
  }

  private async handleMonthlyWageSummary(
    data: WageBody & { monthly_wage_summary_id?: number | null }
  ) {
    const monthAndYear = `${data.month}/${data.year}`;

    if (!data.monthly_wage_summary_id) {
      const summary = await this.wagesRepository.createMonthlyWage({
        user_id: data.user_id,
        month_and_year: monthAndYear,
        total_wage: data.amount,
        remaining: data.amount,
      });

      data.monthly_wage_summary_id = summary.id;

      if (data.monthly_wage_summary_id == null) {
        throw new MissingMonthlyWageSummaryIdError(
          'monthly_wage_summary_id is required'
        );
      }
    } else if (data.monthly_wage_summary_id) {
      await this.wagesRepository.updateMonthlyWageSummary(
        data.monthly_wage_summary_id as number,
        data.amount
      );
    }

    return data;
  }

  private async calculateAmounts(amount: number, currency: 'USD' | 'ARS') {
    const exchangeRate = await this.wagesHttpRepository.getBlueExchangeRate();

    const amountInUSD = currency === 'USD' ? amount : amount / exchangeRate;
    const amountInARS = currency === 'ARS' ? amount : amount * exchangeRate;

    return { amountInUSD, amountInARS, exchangeRate };
  }

  private async updateBudgetsAllocations(
    userId: string,
    wageAmount: number,
    monthlyWageSummaryId: number
  ) {
    const [budgetConfigurations] =
      await this.budgetsRepository.findBudgetConfigurationWhere({
        user_id: userId,
        is_active: true,
      });

    const budgets = budgetConfigurations.budgets;

    await Promise.all(
      budgets.map((budget) => {
        const budgetAmount = (budget.percentage / 100) * wageAmount;

        const updateData = {
          id: budget.id,
          remaining_allocation: budget.remaining_allocation + budgetAmount,
          monthly_wage_summary_id: monthlyWageSummaryId,
          updated_at: new Date(),
        };

        return this.budgetsRepository.singuleUpdateBudget(updateData);
      })
    );
  }
}
