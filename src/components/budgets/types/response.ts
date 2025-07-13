import { Budgets, BudgetsConfigurations } from '@prisma/client';

export interface BudgetResponse {
  success: boolean;
  message: string;
}

export interface BudgetDetailsResponse {
  id: number;
  user_id: string;
  name: string;
  percentage: number;
  remaining_allocation: number;
  budget_configuration_id: number | null;
  monthly_wage_summary_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface BudgetConfigurationWithBudgets extends BudgetsConfigurations {
  budgets: Budgets[];
}

export interface BudgetConfigurationResponse {
  id: number;
  name: string;
  budgets: {
    id: number;
    name: string;
    percentage: number;
    remaining_allocation: number;
    monthly_wage_summary_id: number | null;
  }[];
}
