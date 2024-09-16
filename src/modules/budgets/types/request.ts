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
  create?: boolean;
  delete?: boolean;
};

export type PatchBudgetBody = {
  user_id: string;
  budget_configuration_name?: string;
  budgets?: BudgetAction[];
};

export type PatchBudgetParams = {
  id: number;
};

export type PatchBudgetPayload = PatchBudgetBody & {
  budget_configuration_id: PatchBudgetParams['id'];
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
