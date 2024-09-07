export type PostBudgetParams = {
  user_id: string;
  budget_configuration_name: string;
  budgets: {
    name: string;
    percentage: number;
  }[];
};
