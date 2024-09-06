// ./entity/BudgetBuilder.ts

import { Budget } from '.';

interface IBudgetBuilder {
  setId(id: number): this;
  setUserId(userId: number): this;
  setName(name: string): this;
  setPercentage(percentage: number): this;
  setRemainingAllocation(remainingAllocation: number): this;
  setTransferToBudgetId(budgetId: number): this;
  setMonthlyWageId(monthlyWageId: number): this;
  build(): Budget;
}

export class BudgetBuilder implements IBudgetBuilder {
  private id!: number;
  private user_id!: number;
  private name!: string;
  private percentage!: number;
  private remaining_allocation!: number;
  private transfer_to_budget_id?: number;
  private monthly_wage_id?: number;

  setId(id: number): this {
    this.id = id;
    return this;
  }

  setUserId(userId: number): this {
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
      this.id,
      this.user_id,
      this.name,
      this.percentage,
      this.remaining_allocation,
      this.transfer_to_budget_id,
      this.monthly_wage_id
    );
  }
}
