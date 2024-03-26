import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumberString, IsString } from 'class-validator';

export class UpdateEmployeeDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNumberString()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: Express.Multer.File;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => {
    return Boolean(value);
  })
  isWorking: boolean;
}
