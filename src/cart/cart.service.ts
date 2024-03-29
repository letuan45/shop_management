import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private cartRepository: CartRepository) {}

  async createCart(userId: number) {
    await this.cartRepository.create(userId);
  }
}
