import { Axios } from 'axios';
import { retry } from 'utils/helpers/functions';
export interface IWagesHttpRepository {
  getBlueExchangeRate(): Promise<number>;
}

export default class WagesHttpRepository implements IWagesHttpRepository {
  private readonly fallbackExchangeRate = 1300;

  constructor(
    private axios: Axios,
    private logger: Console = console,
    private retryAttempts = 3
  ) {}

  async getBlueExchangeRate(): Promise<number> {
    try {
      const data = await retry(async () => {
        const { data } = await this.axios.get(
          'https://dolarapi.com/v1/dolares/blue'
        );
        if (!data?.venta || typeof data.venta !== 'number') {
          throw new Error('Invalid exchange rate data');
        }
        return data;
      }, this.retryAttempts);

      return data.venta;
    } catch (error) {
      this.logger.error('Failed to fetch exchange rate after retries:', error);
      this.logger.warn(
        `Using fallback exchange rate: ${this.fallbackExchangeRate}`
      );
      return this.fallbackExchangeRate;
    }
  }
}
