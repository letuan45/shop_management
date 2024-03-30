import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  importPrice: number;

  @ApiProperty()
  exportPrice: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty({ type: 'file', format: 'binary', required: true })
  file: Express.Multer.File;
}
