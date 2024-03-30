import { ApiProperty } from '@nestjs/swagger';

export class CreateProductResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  importPrice: number;

  @ApiProperty()
  exportPrice: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
