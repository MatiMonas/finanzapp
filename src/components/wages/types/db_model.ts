export type Wage = {
  user_id: string;
  amount: number;
  currency: 'USD' | 'ARS';
  exchange_rate: number;
  amount_in_usd: number;
  amount_in_ars: number;
  month_and_year: string;
  monthly_wage_summary_id: number;
};

export type MonthlyWageSummary = {
  id?: number;
  user_id: string;
  month_and_year: string;
  total_wage?: number;
  remaining?: number;
  monthly_wage_summary_id?: number;
};
