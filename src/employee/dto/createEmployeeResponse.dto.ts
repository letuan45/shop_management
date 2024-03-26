import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeResponseDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  dateOfBirth: Date;
}
