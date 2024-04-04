import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class SellingOrderItem {
  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => +value)
  productId: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => +value)
  quantity: number;
}
