import { catchError, lastValueFrom, throwError } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { MakeReceiptOrderDto } from './dtos/makeReceiptOrder.dto';
import {
  MakeReceiptOrderTransferDto,
  ReceiptOrderItem,
} from './dtos/makeReceiptOrderT.dto';

@Injectable()
export class ReceiptService {
  constructor(
    @Inject('RECEIPTS_SERVICE') private rabbitOrderClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private rabbitProductClient: ClientProxy,
  ) {}

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
          return {
            id: product.id,
            price: product.exportPrice,
            quantity: orderItem.quantity,
          };
        } catch (error) {
          console.error('Error retrieving product:', error);
          return null;
        }
      }),
    );

    const productsToAdd = products.filter((product) => product !== null);
    const transferProducts: ReceiptOrderItem[] = productsToAdd.map(
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

    return transferObj;
  }
}
