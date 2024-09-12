export type FindBudgetConfigurationByName = {
  id: number;
  user_id: string;
  name: string;
} | null;

export type BudgetWithoutTimestamps = {
  id: number;
  name: string;
  percentage: number;
  remaining_allocation: number;
  budget_configuration_id: number | null;
  transfer_to_budget_id: number | null;
  monthly_wage_id: number | null;
  user_id: string;
} | null;
