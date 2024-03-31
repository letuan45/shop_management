import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSupplierQueryDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  search: string;
}
