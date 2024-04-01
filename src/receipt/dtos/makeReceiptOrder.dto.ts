import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

class ReceiptOrderItem {
  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => +value)
  productId: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => +value)
  quantity: number;
}

export class MakeReceiptOrderDto {
  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => +value)
  supplierId: number;

  @ApiProperty({ type: [ReceiptOrderItem] })
  @Type(() => ReceiptOrderItem)
  receiptOrderItems: ReceiptOrderItem[];
}
