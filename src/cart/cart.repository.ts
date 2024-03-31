import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  async getCartItemById(id: number) {
    return await this.prisma.cartItem.findUnique({ where: { id } });
  }

  async create(userId: number) {
    return await this.prisma.cart.create({ data: { userId: userId } });
  }

  async createCartItem(cartId: number, productId: number, quantity: number) {
    return await this.prisma.cartItem.create({
      data: { cartId, productId, quantity },
    });
  }

  async getCartItemByCartIdAndProductId(cartId: number, productId: number) {
    return await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });
  }

  async updateCartItemQuantity(cartItemId: number, quantity: number) {
    return await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity,
      },
    });
  }

  async deleteCartItem(id: number) {
    return await this.prisma.cartItem.delete({ where: { id } });
  }
}
