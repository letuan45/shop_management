import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_CATE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_URL],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
