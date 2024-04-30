import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class StatsService {
  constructor(
    @Inject('RECEIPTS_SERVICE') private rabbitOrderClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private rabbitProductClient: ClientProxy,
  ) {}

  async getHomePageStats() {
    const orderStats: { totalSellingBill: number; totalCustomer: number } =
      await lastValueFrom(
        this.rabbitOrderClient.send({ cmd: 'get_home_stats' }, {}),
      );

    const productStat: { totalProduct: number; totalStocks: number } =
      await lastValueFrom(
        this.rabbitProductClient.send({ cmd: 'get_product_stats' }, {}),
      );

    return { ...orderStats, ...productStat };
  }

  async getHomeMonthly() {
    return this.rabbitOrderClient.send({ cmd: 'get_monthly_bills' }, {});
  }
}
