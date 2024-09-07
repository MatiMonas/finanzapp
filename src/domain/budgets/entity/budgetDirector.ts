import { Budget } from '.';
import { PostBudgetParams } from '../types';
import { BudgetBuilder } from './budgetBuilder';

export class BudgetDirector {
  private builder: BudgetBuilder;

  constructor(builder: BudgetBuilder) {
    this.builder = builder;
  }

  createBudget(budgetData: PostBudgetParams): Budget {
    return this.builder
      .setUserId(budgetData.user_id)
      .setName(budgetData.name)
      .setPercentage(budgetData.percentage)
      .build();
  }
}
