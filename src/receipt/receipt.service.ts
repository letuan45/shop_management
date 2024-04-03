import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  MakeReceiptOrderDto,
  ReceiptOrderItem,
} from './dtos/makeReceiptOrder.dto';
import {
  MakeReceiptOrderTransferDto,
  ReceiptOrderTransferItem,
} from './dtos/makeReceiptOrderT.dto';
import { ReceiptQueryParamsDto } from './dtos/paramDto';

@Injectable()
export class ReceiptService {
  constructor(
    @Inject('RECEIPTS_SERVICE') private rabbitOrderClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private rabbitProductClient: ClientProxy,
  ) {}

  async getOrders(params: ReceiptQueryParamsDto) {
    return this.rabbitOrderClient.send({ cmd: 'get_receipt_orders' }, params);
  }

  async getBills(params: ReceiptQueryParamsDto) {
    return this.rabbitOrderClient.send({ cmd: 'get_receipt_bills' }, params);
  }

  async getOrderById(id: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'get_receipt_order_by_id' }, { id })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async makeReceipt(
    employeeId: number,
    makeReceiptOrderDto: MakeReceiptOrderDto,
  ) {
    // Check product
    const products = await Promise.all(
      makeReceiptOrderDto.receiptOrderItems.map(async (orderItem) => {
        try {
          const product = await lastValueFrom(
            this.rabbitProductClient
              .send({ cmd: 'get_product_by_id' }, { id: orderItem.productId })
              .pipe(
                catchError((error) => {
                  return throwError(() => new RpcException(error.response));
                }),
              ),
          );
          if (orderItem.quantity <= 0) {
            throw new ConflictException('Dữ liệu đơn hàng không hợp lệ!');
          }

          return {
            id: product.id,
            price: product.importPrice,
            quantity: orderItem.quantity,
          };
        } catch (error) {
          const message = error?.message ?? 'Error retrieving product';
          throw new ConflictException(message);
        }
      }),
    );

    const productsToAdd = products.filter((product) => product !== null);
    const transferProducts: ReceiptOrderTransferItem[] = productsToAdd.map(
      (product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      }),
    );
    const transferObj = new MakeReceiptOrderTransferDto(
      employeeId,
      makeReceiptOrderDto.supplierId,
      transferProducts,
    );

    return this.rabbitOrderClient
      .send({ cmd: 'make_receipt_order' }, transferObj)
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async addItemToOrder(orderId: number, receiptOrderItem: ReceiptOrderItem) {
    const product = await lastValueFrom(
      this.rabbitProductClient
        .send({ cmd: 'get_product_by_id' }, { id: receiptOrderItem.productId })
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );

    const transferObj = {
      orderId,
      productId: receiptOrderItem.productId,
      quantity: receiptOrderItem.quantity,
      price: product.importPrice,
    };

    return this.rabbitOrderClient
      .send({ cmd: 'add_receipt_order_item' }, transferObj)
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async plusOneQtyOrderDetail(orderDetailId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'plus_one_qty_order_detail' }, { orderDetailId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async minusOneQtyOrderDetail(orderDetailId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'minus_one_qty_order_detail' }, { orderDetailId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async updateOrderDetailQuantity(orderDetailId: number, quantity: number) {
    if (quantity <= 0) {
      throw new ConflictException('Số lượng không hợp lệ!');
    }
    return this.rabbitOrderClient
      .send({ cmd: 'update_order_detail_qty' }, { orderDetailId, quantity })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async deleteOrderDetail(orderDetailId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'delete_order_detail' }, { orderDetailId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async cancelOrder(orderId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'cancel_receipt_order' }, { orderId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async makeBill(userId: number, orderId: number) {
    return this.rabbitOrderClient
      .send({ cmd: 'make_receipt_bill' }, { userId, orderId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }
}
