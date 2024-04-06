import { async, catchError, lastValueFrom, throwError } from 'rxjs';
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
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class ReceiptService {
  constructor(
    private employeeService: EmployeeService,
    @Inject('RECEIPTS_SERVICE') private rabbitOrderClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private rabbitProductClient: ClientProxy,
  ) {}

  async getOrders(params: ReceiptQueryParamsDto) {
    const result = await lastValueFrom(
      this.rabbitOrderClient.send({ cmd: 'get_receipt_orders' }, params),
    );
    const data = await Promise.all(
      result['data'].map(async (item: any) => {
        const employee = await this.employeeService.getEmployee(
          item['employeeId'],
        );
        return { ...item, employee };
      }),
    );
    return {
      ...result,
      data,
    };
  }

  async getBills(params: ReceiptQueryParamsDto) {
    const result = await lastValueFrom(
      this.rabbitOrderClient.send({ cmd: 'get_receipt_bills' }, params),
    );
    const data = await Promise.all(
      result['data'].map(async (item: any) => {
        const employee = await this.employeeService.getEmployee(
          item['employeeId'],
        );
        return { ...item, employee };
      }),
    );
    return {
      ...result,
      data,
    };
  }

  async getBillById(id: number) {
    let billData = await lastValueFrom(
      this.rabbitOrderClient
        .send({ cmd: 'get_receipt_bill_by_id' }, { id })
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );
    const employee = await this.employeeService.getEmployee(
      billData['employeeId'],
    );
    billData = { ...billData, employee };
    const billDetails = await Promise.all(
      billData.receiptBillDetails.map(async (detailItem: any) => {
        const product = await lastValueFrom(
          this.rabbitProductClient
            .send({ cmd: 'get_product_by_id' }, { id: detailItem.productId })
            .pipe(
              catchError((error) => {
                return throwError(() => new RpcException(error.response));
              }),
            ),
        );
        return { ...detailItem, product };
      }),
    );
    return { ...billData, receiptBillDetails: billDetails };
  }

  async getOrderById(id: number) {
    let orderData = await lastValueFrom(
      this.rabbitOrderClient
        .send({ cmd: 'get_receipt_order_by_id' }, { id })
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );
    const employee = await this.employeeService.getEmployee(
      orderData['employeeId'],
    );
    orderData = { ...orderData, employee };
    const orderDetails = await Promise.all(
      orderData['ReceiptOrderDetail'].map(async (detailItem: any) => {
        const product = await lastValueFrom(
          this.rabbitProductClient
            .send({ cmd: 'get_product_by_id' }, { id: detailItem.productId })
            .pipe(
              catchError((error) => {
                return throwError(() => new RpcException(error.response));
              }),
            ),
        );
        return { ...detailItem, product };
      }),
    );
    return { ...orderData, ReceiptOrderDetail: orderDetails };
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
    const receiptBill = await lastValueFrom(
      this.rabbitOrderClient
        .send({ cmd: 'make_receipt_bill' }, { userId, orderId })
        .pipe(
          catchError((error) => {
            return throwError(() => new RpcException(error.response));
          }),
        ),
    );

    // Increase products stock
    const receiptBillDetails = receiptBill?.receiptBillDetails;
    await Promise.all(
      receiptBillDetails.map(async (detail: any) => {
        return await lastValueFrom(
          this.rabbitProductClient
            .send(
              { cmd: 'increase_stock' },
              { id: detail.productId, quantity: detail.quantity },
            )
            .pipe(
              catchError((error) => {
                return throwError(() => new RpcException(error.response));
              }),
            ),
        );
      }),
    );

    return receiptBill;
  }
}
