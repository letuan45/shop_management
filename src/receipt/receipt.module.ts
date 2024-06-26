import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmployeeModule } from 'src/employee/employee.module';
import { PrismaService } from 'src/prisma/prisma.service';

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
    EmployeeModule,
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService, PrismaService],
})
export class ReceiptModule {}
