import { Wage } from '.';

export class WageBuilder {
  private user_id!: string;
  private amount: number = 0.0;
  private date: Date = new Date();
  private exchange_rate: number = 0.0;
  private created_at: Date = new Date();
  private updated_at: Date = new Date();
  private deleted_at?: Date;

  setUserId(user_id: string): this {
    this.user_id = user_id;
    return this;
  }

  setAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  setMonth(date: Date): this {
    this.date = date;
    return this;
  }

  setExchangeRate(exchange_rate: number): this {
    this.exchange_rate = exchange_rate;
    return this;
  }

  build(): Wage {
    return new Wage(
      this.user_id,
      this.amount,
      this.date,
      this.exchange_rate,
      this.created_at,
      this.updated_at,
      this.deleted_at
    );
  }
}
