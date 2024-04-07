import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';
import { GetSupplierQueryDto } from './dtos/getSupplierQuery.dto';
import { AtAuthGuard } from 'src/auth/guards/at.guard';
import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';

@ApiTags('Supplier')
@Controller('supplier')
@UseGuards(AtAuthGuard, AdminRoleGuard)
@ApiBearerAuth()
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
