import { ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerQueryParamsDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  search: string;
}
