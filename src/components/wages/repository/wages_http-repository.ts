import { Axios } from 'axios';

export interface IWagesHttpRepository {}

export default class WagesHttpRepository implements IWagesHttpRepository {
  constructor(private axios: Axios) {}
}
