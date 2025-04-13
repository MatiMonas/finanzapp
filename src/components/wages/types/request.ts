export type WageBody = {
  user_id: string;
  amount: number;
  month: string;
  year: string;
  currency: 'USD' | 'ARS';
};

export type WagesParams = Partial<{
  user_id: string;
  amount: number;
  month_and_year: string;
  exchange_rate: number;
  currency: 'USD' | 'ARS';
}>;
