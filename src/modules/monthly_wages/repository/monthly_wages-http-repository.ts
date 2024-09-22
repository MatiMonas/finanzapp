import { Axios } from 'axios';

export interface IMonthlyWagesHttpRepository {}

export class MonthlyWagesHttpRepository implements IMonthlyWagesHttpRepository {
  constructor(private axios: Axios) {}
}
