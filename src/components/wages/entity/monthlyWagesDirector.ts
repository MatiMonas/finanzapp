import { WageBuilder } from './monthlyWagesBuilder';

import { Wage } from '.';

export class WageDirector {
  constructor(private builder: WageBuilder) {}

  construct(user_id: string, amount: number, date: Date): Wage {
    return this.builder
      .setUserId(user_id)
      .setAmount(amount)
      .setMonth(date)
      .build();
  }
}
