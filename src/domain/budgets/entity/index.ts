export class Budget {
  constructor(
    public readonly id: number,
    public readonly user_id: number,
    public readonly name: string,
    public readonly percentage: number,
    public readonly remaining_allocation: number,
    public readonly transfer_to_budget_id?: number,
    public readonly monthly_wage_id?: number
  ) {}
}
