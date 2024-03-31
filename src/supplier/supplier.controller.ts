import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';

@ApiTags('Supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  async get() {}

  async getSupplier() {}

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
