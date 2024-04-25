import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: 'file', format: 'binary', required: false })
  file: Express.Multer.File;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  status: number;

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
  cateId: number;
}
