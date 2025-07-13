// Tipos internos del dominio de budgets
// Usados entre repository, usecase y otras capas internas

export interface CreateBudgetPayload {
  name: string;
  percentage: number;
  user_id: string;
  budget_configuration_id: number;
}

export interface DeleteBudgetConfigurationPayload {
  user_id: string;
  budget_configuration_id: number;
}

export interface SingleUpdateBudgetAction {
  id: number;
  remaining_allocation?: number;
  updated_at?: Date;
  monthly_wage_summary_id?: number;
}
