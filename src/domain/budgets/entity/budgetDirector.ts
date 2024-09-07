import { Budget } from '.';
import { CreateBudgetParams, PostBudgetParams } from '../types';
import { BudgetBuilder } from './budgetBuilder';

export class BudgetDirector {
  private builder: BudgetBuilder;

  constructor(builder: BudgetBuilder) {
    this.builder = builder;
  }

  createBudget(budgetData: CreateBudgetParams): Budget {
    return this.builder
      .setUserId(budgetData.user_id)
      .setName(budgetData.name)
      .setPercentage(budgetData.percentage)
      .setBudgetConfigurationId(budgetData.budget_configuration_id)
      .build();
  }
}
