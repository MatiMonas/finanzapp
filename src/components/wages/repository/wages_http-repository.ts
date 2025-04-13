// repository/wages_http-repository.ts
import { Axios } from 'axios';

export interface IWagesHttpRepository {
  getBlueExchangeRate(): Promise<number>;
}

export default class WagesHttpRepository implements IWagesHttpRepository {
  constructor(private axios: Axios) {}

  async getBlueExchangeRate(): Promise<number> {
    try {
      const { data } = await this.axios.get(
        'https://dolarapi.com/v1/dolares/blue'
      );
      return data.venta;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      throw new Error('No se pudo obtener el tipo de cambio');
    }
  }
}
