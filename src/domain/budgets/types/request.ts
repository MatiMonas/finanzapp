export type PostBudgetConfigurationParams = {
  user_id: string;
  budget_configuration_name: string;
  budgets: {
    name: string;
    percentage: number;
  }[];
};

export type PatchBudgetParams = {
  budget_configuration_id: number;
  user_id: string;
  budget_configuration_name?: string;
  budgets?: BudgetAction[];
};

export type CreateBudgetParams = {
  user_id: string;
  name: string;
  percentage: number;
  budget_configuration_id: number;
};

export type BudgetAction = {
  id?: number;
  name?: string;
  percentage?: number;
  create?: boolean;
  delete?: boolean;
};
