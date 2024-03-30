import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductResponseDto {
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
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  categoryId: number;
}
