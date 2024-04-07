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
import { CustomerService } from './customer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from './dtos/createCustomer.dto';
import { CustomerQueryParamsDto } from './dtos/paramDto';
import { AtAuthGuard } from 'src/auth/guards/at.guard';

@ApiTags('Customer')
@Controller('customer')
@UseGuards(AtAuthGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  async get(@Query() queryParam: CustomerQueryParamsDto) {
    queryParam.page = queryParam.page ? +queryParam.page : 1;
    return await this.customerService.get(queryParam);
  }

  @Get(':customerId')
  async getCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return await this.customerService.getCustomer(customerId);
  }

  @Post('create')
  async create(@Body(ValidationPipe) createCustomerDto: CreateCustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }

  @Put(':customerId')
  async update(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body(ValidationPipe) createCusomerDto: CreateCustomerDto,
  ) {
    return await this.customerService.update(customerId, createCusomerDto);
  }
}
