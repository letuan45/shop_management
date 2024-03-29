import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: number) {
    return await this.prisma.cart.create({ data: { userId: userId } });
  }
}
