import { Axios } from 'axios';

export interface IWagesHttpRepository {}

export default class WagesHttpRepository implements IWagesHttpRepository {
  constructor(private axios: Axios) {
    // TODO: Add calls to api to get exchange_rate
  }
}
