import { ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeQueryParamsDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  search: string;
}
