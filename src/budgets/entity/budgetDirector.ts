import { Budget } from '.';
import { BudgetBuilder } from './budgetBuilder';

export class BudgetDirector {
  private builder: BudgetBuilder;

  constructor(builder: BudgetBuilder) {
    this.builder = builder;
  }

  createBasicBudget(userId: number, name: string): Budget {
    return this.builder
      .setUserId(userId)
      .setName(name)
      .setPercentage(0.0)
      .setRemainingAllocation(0.0)
      .build();
  }

  createCustomBudget(
    userId: number,
    name: string,
    percentage: number,
    remainingAllocation: number
  ): Budget {
    return this.builder
      .setUserId(userId)
      .setName(name)
      .setPercentage(percentage)
      .setRemainingAllocation(remainingAllocation)
      .build();
  }
}
