// ./entity/BudgetBuilder.ts

import { Budget } from '.';

interface IBudgetBuilder {
  setUserId(userId: string): this;
  setName(name: string): this;
  setPercentage(percentage: number): this;
  setBudgetConfigurationId(budgetConfigurationId: number): this;
  setRemainingAllocation(remainingAllocation: number): this;
  setTransferToBudgetId(budgetId: number): this;
  setMonthlyWageId(monthlyWageId: number): this;
  build(): Budget;
}

export class BudgetBuilder implements IBudgetBuilder {
  private id!: number;
  private user_id!: string;
  private name!: string;
  private percentage!: number;
  private remaining_allocation!: number;
  private budget_configuration_id!: number;
  private transfer_to_budget_id?: number;
  private monthly_wage_id?: number;

  setUserId(userId: string): this {
    this.user_id = userId;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setPercentage(percentage: number): this {
    this.percentage = percentage;
    return this;
  }

  setBudgetConfigurationId(budgetConfigurationId: number): this {
    this.budget_configuration_id = budgetConfigurationId;
    return this;
  }

  setRemainingAllocation(remainingAllocation: number): this {
    this.remaining_allocation = remainingAllocation;
    return this;
  }

  setTransferToBudgetId(budgetId: number): this {
    this.transfer_to_budget_id = budgetId;
    return this;
  }

  setMonthlyWageId(monthlyWageId: number): this {
    this.monthly_wage_id = monthlyWageId;
    return this;
  }

  build(): Budget {
    return new Budget(
      this.user_id,
      this.name,
      this.percentage,
      this.budget_configuration_id,
      this.remaining_allocation,
      this.transfer_to_budget_id,
      this.monthly_wage_id
    );
  }
}
