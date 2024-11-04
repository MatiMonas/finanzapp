export type WageBody = {
  user_id: string;
  amount: number;
  month: string;
  year: string;
  exchange_rate: number;
};

export type WagesParams = Partial<{
  user_id: string;
  amount: number;
  month: string;
  year: string;
  exchange_rate: number;
}>;
