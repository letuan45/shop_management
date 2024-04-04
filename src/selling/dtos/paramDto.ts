import { ApiPropertyOptional } from '@nestjs/swagger';

export class SellingQueryParamsDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  search: string;
}
