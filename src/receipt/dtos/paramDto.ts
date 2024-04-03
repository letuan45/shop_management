import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReceiptQueryParamsDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  search: string;
}
