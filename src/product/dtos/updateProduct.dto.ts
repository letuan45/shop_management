import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'file', format: 'binary', required: false })
  file: Express.Multer.File;

  @ApiProperty()
  status: number;

  @ApiProperty()
  importPrice: number;

  @ApiProperty()
  exportPrice: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  cateId: number;
}
