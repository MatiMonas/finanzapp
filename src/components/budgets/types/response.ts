import { Budgets, BudgetsConfigurations } from '@prisma/client';

export type BudgetConfigurationWithBudgets = BudgetsConfigurations & {
  budgets: Budgets[];
};
