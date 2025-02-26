import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SUPPLIERS_SERVICE',
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
  ],
  providers: [SupplierService, PrismaService],
  controllers: [SupplierController],
})
export class SupplierModule {}
