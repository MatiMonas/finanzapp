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
    // console.log(data);

    let monthlyWageSummary;
    if (!data.monthly_wage_summary_id) {
      console.log('Creating new monthly wage summary');
      monthlyWageSummary = await this.wagesRepository.createMonthlyWage({
        user_id: data.user_id,
        month_and_year: data.month_and_year,
        total_wage: data.amount,
        remaining: data.amount,
      });

      data.monthly_wage_summary_id = monthlyWageSummary.id;
    } else {
      console.log('Updating existing monthly wage summary');
      await this.wagesRepository.updateMonthlyWageSummary(
        data.monthly_wage_summary_id,
        data.amount
      );
    }

    const exchangeRate = await this.wagesHttpRepository.getBlueExchangeRate();

    const amountInUSD =
      data.currency === 'USD' ? data.amount : data.amount / exchangeRate;
    const amountInARS =
      data.currency === 'ARS' ? data.amount : data.amount * exchangeRate;

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

    const [budgetConfigurations] =
      await this.budgetsRepository.findBudgetConfigurationWhere({
        user_id: data.user_id,
        is_active: true,
      });

    const budgets = budgetConfigurations.budgets;

    await Promise.all(
      budgets.map((budget) => {
        const percentage = budget.percentage;
        const remainingAllocation = budget.remaining_allocation;

        const wageAmount = data.amount;
        const budgetAmount = (percentage / 100) * wageAmount;

        const updateData = {
          id: budget.id,
          remaining_allocation: remainingAllocation + budgetAmount,
          monthly_wage_summary_id: data.monthly_wage_summary_id,
          updated_at: new Date(),
        };

        this.budgetsRepository.singuleUpdateBudget(updateData);

        return budget;
      })
    );

    return true;
  }
}
