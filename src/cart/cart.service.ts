import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    private cartRepository: CartRepository,
    @Inject('PRODUCTS_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  async getCart(id: number) {
    const cart = await this.cartRepository.getById(id);
    const cartData = await Promise.all(
      cart.cartItems.map(async (item) => {
        const product = await lastValueFrom(
          this.rabbitClient
            .send({ cmd: 'get_product_by_id' }, { id: item.productId })
            .pipe(
              catchError((error) => {
                return throwError(() => new RpcException(error.response));
              }),
            ),
        );
        return { ...item, product };
      }),
    );
    return { ...cart, cartItems: cartData };
  }

  async createCartItem(cartId: number, productId: number, quantity: number) {
    // Exception for product not found
    const product = await lastValueFrom(
      this.rabbitClient
        .send({ cmd: 'get_product_by_id' }, { id: productId })
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );

    //Exception for quantity negative or equal 0
    if (quantity <= 0) {
      throw new ConflictException('Số lượng không hợp lệ!');
    }

    const existCartItem =
      await this.cartRepository.getCartItemByCartIdAndProductId(
        cartId,
        productId,
      );
    if (existCartItem) {
      return await this.cartRepository.updateCartItemQuantity(
        existCartItem.id,
        existCartItem.quantity + quantity,
      );
    }

    return await this.cartRepository.createCartItem(
      cartId,
      +product.id,
      quantity,
    );
  }

  async createCart(userId: number) {
    await this.cartRepository.create(userId);
  }

  async plusOneCartItem(cartId: number, productId: number) {
    // Exception for product not found
    const product = await lastValueFrom(
      this.rabbitClient
        .send({ cmd: 'get_product_by_id' }, { id: productId })
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );

    const existCartItem =
      await this.cartRepository.getCartItemByCartIdAndProductId(
        cartId,
        product.id,
      );
    if (existCartItem) {
      return await this.cartRepository.updateCartItemQuantity(
        existCartItem.id,
        existCartItem.quantity + 1,
      );
    }

    throw new NotFoundException('Không tìm thấy chi tiết giỏ hàng!');
  }

  async minusOneCartItem(cartId: number, productId: number) {
    // Exception for product not found
    const product = await lastValueFrom(
      this.rabbitClient
        .send({ cmd: 'get_product_by_id' }, { id: productId })
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );

    const existCartItem =
      await this.cartRepository.getCartItemByCartIdAndProductId(
        cartId,
        product.id,
      );
    if (existCartItem) {
      if (existCartItem.quantity === 1) {
        // Delete cart item
        await this.cartRepository.deleteCartItem(existCartItem.id);
        return { message: 'Chi tiết đơn hàng đã hoàn toàn xóa!' };
      }
      return await this.cartRepository.updateCartItemQuantity(
        existCartItem.id,
        existCartItem.quantity - 1,
      );
    }

    throw new NotFoundException('Không tìm thấy chi tiết giỏ hàng!');
  }

  async updateCartItemQuantity(
    cartId: number,
    productId: number,
    quantity: number,
  ) {
    // Exception for product not found
    const product = await lastValueFrom(
      this.rabbitClient
        .send({ cmd: 'get_product_by_id' }, { id: productId })
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );

    //Exception for quantity negative or equal 0
    if (quantity <= 0) {
      throw new ConflictException('Số lượng không hợp lệ!');
    }

    const existCartItem =
      await this.cartRepository.getCartItemByCartIdAndProductId(
        cartId,
        product.id,
      );
    if (!existCartItem) {
      throw new NotFoundException('Không tìm thấy chi tiết đơn hàng!');
    }
    return await this.cartRepository.updateCartItemQuantity(
      existCartItem.id,
      quantity,
    );
  }

  async deleteCartItem(cartItemId: number) {
    const cartItem = await this.cartRepository.getCartItemById(cartItemId);
    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy chi tiết đơn hàng!');
    }

    await this.cartRepository.deleteCartItem(cartItemId);

    return { message: 'Chi tiết đơn hàng đã hoàn toàn xóa!' };
  }
}
