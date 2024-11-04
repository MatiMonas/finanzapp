export class Wage {
  constructor(
    public readonly user_id: string,
    public readonly amount: number,
    public readonly date: Date,
    public readonly exchange_rate: number,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly deleted_at?: Date
  ) {}
}
