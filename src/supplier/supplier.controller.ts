import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';
import { GetSupplierQueryDto } from './dtos/getSupplierQuery.dto';

@ApiTags('Supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get()
  async get(@Query() queryParams: GetSupplierQueryDto) {
    queryParams.page = queryParams.page ? +queryParams.page : 1;
    return await this.supplierService.get(queryParams);
  }

  @Get(':supplierId')
  async getSupplier(@Param('supplierId', ParseIntPipe) supplierId: number) {
    return await this.supplierService.getById(supplierId);
  }

  @Post('create')
  async create(@Body(ValidationPipe) createSupplierDto: CreateSupplierDto) {
    return await this.supplierService.create(createSupplierDto);
  }

  @Put('update/:supplierId')
  async update(
    @Body(ValidationPipe) updateSupplierDto: CreateSupplierDto,
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ) {
    const updateDto = new UpdateSupplierDto(
      supplierId,
      updateSupplierDto.name,
      updateSupplierDto.address,
      updateSupplierDto.phone,
      updateSupplierDto.email,
    );
    return await this.supplierService.update(updateDto);
  }
}
