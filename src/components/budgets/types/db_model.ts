export type BudgetWithoutTimestamps = {
  id: number;
  name: string;
  percentage: number;
  remaining_allocation: number;
  budget_configuration_id: number | null;
  user_id: string;
} | null;
