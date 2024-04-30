import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  roleId: number;

  @ApiProperty()
  isAcive: boolean;

  @ApiProperty()
  isUpdatePwd: boolean;
}
