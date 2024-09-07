export class Budget {
  constructor(
    public readonly user_id: string,
    public readonly name: string,
    public readonly percentage: number,
    public readonly budget_configuration_id: number,
    public readonly remaining_allocation?: number,
    public readonly transfer_to_budget_id?: number,
    public readonly monthly_wage_id?: number
  ) {}
}
