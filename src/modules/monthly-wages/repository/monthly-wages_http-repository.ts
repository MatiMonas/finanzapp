import { Axios } from 'axios';

export interface IMonthlyWagesHttpRepository {}

export default class MonthlyWagesHttpRepository
  implements IMonthlyWagesHttpRepository
{
  constructor(private axios: Axios) {}
}
