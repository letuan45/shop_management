import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom, catchError, throwError } from 'rxjs';
import {
  MakeSellingOrderTransferDto,
  SellingOrderTransferItem,
} from './dtos/makeSellingOrderT.dto';
import { CartService } from 'src/cart/cart.service';
import { SellingOrderItem } from './dtos/sellingOrder.dto';
import { SellingQueryParamsDto } from './dtos/paramDto';

@Injectable()
export class SellingService {
  constructor(
    private cartService: CartService,
    @Inject('RECEIPTS_SERVICE') private rabbitOrderClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private rabbitProductClient: ClientProxy,
  ) {}

  async getOrders(queryParam: SellingQueryParamsDto) {
    return this.rabbitOrderClient.send(
      { cmd: 'get_selling_orders' },
      queryParam,
    );
  }

  async getOrder(orderId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'get_selling_order' }, { orderId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async makeOrder(employeeId: number, cartId: number, customerId: number) {
    // Get user's cart
    const cart = await this.cartService.getCart(cartId);
    const cartItems = cart.cartItems;
    // Check product
    const products = await Promise.all(
      cartItems.map(async (cartItem) => {
        try {
          const product = await lastValueFrom(
            this.rabbitProductClient
              .send({ cmd: 'get_product_by_id' }, { id: cartItem.productId })
              .pipe(
                catchError((error) => {
                  return throwError(() => new RpcException(error.response));
                }),
              ),
          );
          if (cartItem.quantity <= 0) {
            throw new ConflictException('Dữ liệu đơn hàng không hợp lệ!');
          }
          return {
            id: product.id,
            price: product.exportPrice,
            quantity: cartItem.quantity,
          };
        } catch (error) {
          const message = error?.message ?? 'Error retrieving product';
          throw new ConflictException(message);
        }
      }),
    );
    const productsToAdd = products.filter((product) => product !== null);
    const transferProducts: SellingOrderTransferItem[] = productsToAdd.map(
      (product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      }),
    );
    const transferObj = new MakeSellingOrderTransferDto(
      employeeId,
      customerId,
      transferProducts,
    );
    const order = await lastValueFrom(
      this.rabbitOrderClient
        .send({ cmd: 'make_selling_order' }, transferObj)
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );

    // Clear cart
    await Promise.all(
      cartItems.map(async (cartItem) => {
        return await this.cartService.deleteCartItem(cartItem.id);
      }),
    );

    return order;
  }

  async addOrderDetail(orderId: number, sellingOrderItem: SellingOrderItem) {
    const product = await lastValueFrom(
      this.rabbitProductClient
        .send({ cmd: 'get_product_by_id' }, { id: sellingOrderItem.productId })
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );

    const transferObj = {
      orderId,
      productId: sellingOrderItem.productId,
      quantity: sellingOrderItem.quantity,
      price: product.exportPrice,
    };

    return this.rabbitOrderClient
      .send({ cmd: 'add_selling_order_item' }, transferObj)
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async plusOneQtyOrderDetail(orderDetailId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'plus_one_qty_selling_order_detail' }, { orderDetailId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async minusOneQtyOrderDetail(orderDetailId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'minus_one_qty_selling_order_detail' }, { orderDetailId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async updateOrderDetailQuantity(orderDetailId: number, quantity: number) {
    return this.rabbitOrderClient
      .send(
        { cmd: 'update_selling_qty_order_detail' },
        { orderDetailId, quantity },
      )
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async deleteOrderDetail(orderDetailId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'delete_selling_order_detail' }, { orderDetailId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async cancelOrder(orderId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'cancel_selling_order' }, { orderId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }
}
