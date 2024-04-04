import { Module } from '@nestjs/common';
import { SellingController } from './selling.controller';
import { SellingService } from './selling.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CartService } from 'src/cart/cart.service';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_PRODUCT_URL],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'RECEIPTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_ORDER_URL],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    CartModule,
  ],
  controllers: [SellingController],
  providers: [SellingService, CartService],
})
export class SellingModule {}
