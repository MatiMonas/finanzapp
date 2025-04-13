import Validator from 'validator';
import { IWagesHttpRepository } from '../repository/wages_http-repository';
import { IWagesRepository } from '../repository/wages_repository';
import { WageBody } from '../types/request';
import { ValidatorMonthlyWageExists } from '../validators/validatorMonthlyWageExists';
import { IBudgetRepository } from 'components/budgets/repository/budget-repository';

export interface IWagesUsecase {
  createWage(payload: any): Promise<Boolean>;
}

export default class WagesUsecase implements IWagesUsecase {
  constructor(
    private wagesRepository: IWagesRepository,
    private wagesHttpRepository: IWagesHttpRepository,
    private budgetsRepository: IBudgetRepository
  ) {}

  async createWage(payload: WageBody): Promise<Boolean> {
    const modelValidator = Validator.createValidatorChain([
      new ValidatorMonthlyWageExists(this.wagesRepository),
    ]);

    const data = await modelValidator.validate(payload);

    const updatedData = await this.handleMonthlyWageSummary(data);
    const { amountInUSD, amountInARS, exchangeRate } =
      await this.calculateAmounts(updatedData.amount, updatedData.currency);

    await this.wagesRepository.createWage({
      user_id: data.user_id,
      amount: data.amount,
      exchange_rate: exchangeRate,
      amount_in_usd: amountInUSD,
      amount_in_ars: amountInARS,
      currency: data.currency,
      month_and_year: data.month_and_year,
      monthly_wage_summary_id: data.monthly_wage_summary_id,
    });

    await this.updateBudgetsAllocations(
      updatedData.user_id,
      updatedData.amount,
      updatedData.monthly_wage_summary_id
    );

    return true;
  }

  private async handleMonthlyWageSummary(data: any) {
    if (!data.monthly_wage_summary_id) {
      const summary = await this.wagesRepository.createMonthlyWage({
        user_id: data.user_id,
        month_and_year: data.month_and_year,
        total_wage: data.amount,
        remaining: data.amount,
      });

      data.monthly_wage_summary_id = summary.id;
    } else
      await this.wagesRepository.updateMonthlyWageSummary(
        data.monthly_wage_summary_id,
        data.amount
      );

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
