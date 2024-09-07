export type PostBudgetParams = {
  user_id: string;
  budget_configuration_name: string;
  budgets: {
    name: string;
    percentage: number;
  }[];
};

export type CreateBudgetParams = {
  user_id: string;
  name: string;
  percentage: number;
  budget_configuration_id: number;
};
