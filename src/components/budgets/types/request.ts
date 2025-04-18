export type PostBudgetConfigurationBody = {
  user_id: string;
  budget_configuration_name: string;
  budgets: {
    name: string;
    percentage: number;
  }[];
};

export type BudgetAction = {
  id?: number;
  name?: string;
  percentage?: number;
  remaining_allocation?: number;
  budget_configuration_id?: number;
  monthly_wage_summary_id?: number;
  create?: boolean;
  delete?: boolean;
};

export type SingleUpdateBudgetAction = {
  id: number;
  remaining_allocation: number;
  updated_at: Date;
  monthly_wage_summary_id: number;
};

export type PatchBudgetBody = {
  user_id: string;
  budget_configuration_name?: string;
  budgets?: BudgetAction[];
};

export type BudgetIdParam = {
  id: number;
};

export type PatchBudgetPayload = PatchBudgetBody & {
  budget_configuration_id: BudgetIdParam['id'];
};

export type CreateBudgetPayload = {
  user_id: string;
  name: string;
  percentage: number;
  budget_configuration_id: number;
};

export type DeleteBudgetConfigurationParams = {
  id: number;
};

export type DeleteBudgetConfigurationBody = {
  user_id: string;
};

export type DeleteBudgetConfigurationPayload = DeleteBudgetConfigurationBody & {
  budget_configuration_id: DeleteBudgetConfigurationParams['id'];
};

export type BudgetConfigurationParams = Partial<{
  id: number;
  name: string;
  user_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}>;
