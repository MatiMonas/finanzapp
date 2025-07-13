import { CreateBudgetPayload } from '../types';

import { BudgetBuilder } from './budgetBuilder';

import { Budget } from './index';

export class BudgetDirector {
  private budgetBuilder: BudgetBuilder;

  constructor() {
    this.budgetBuilder = new BudgetBuilder();
  }

  createBudget(budgetData: CreateBudgetPayload): Budget {
    return this.budgetBuilder
      .setUserId(budgetData.user_id)
      .setName(budgetData.name)
      .setPercentage(budgetData.percentage)
      .setBudgetConfigurationId(budgetData.budget_configuration_id)
      .build();
  }
}
