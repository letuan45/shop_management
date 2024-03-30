import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductQueryParamDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  search: string;
}
