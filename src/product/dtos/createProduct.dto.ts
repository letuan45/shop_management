import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  importPrice: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  exportPrice: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  discount: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  categoryId: number;

  @ApiProperty({ type: 'file', format: 'binary', required: true })
  file: Express.Multer.File;
}
