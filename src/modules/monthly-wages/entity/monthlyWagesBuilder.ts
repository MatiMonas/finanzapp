import { MonthlyWage } from '.';
import { MonthlyWageBuilder } from './monthlyWagesDirector';

export class MonthlyWageDirector {
  constructor(private builder: MonthlyWageBuilder) {}

  construct(user_id: string, amount: number, date: Date): MonthlyWage {
    return this.builder
      .setUserId(user_id)
      .setAmount(amount)
      .setMonth(date)
      .build();
  }
}
