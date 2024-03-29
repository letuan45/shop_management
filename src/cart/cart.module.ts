import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartRepository } from './cart.repository';

@Module({
  providers: [CartService, PrismaService, CartRepository],
  controllers: [CartController],
})
export class CartModule {}
