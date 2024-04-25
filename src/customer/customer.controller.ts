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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from './dtos/createCustomer.dto';
import { AtAuthGuard } from 'src/auth/guards/at.guard';

@ApiTags('Customer')
@Controller('customer')
@UseGuards(AtAuthGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async get(@Query('page') page?: number, @Query('search') search?: string) {
    const actualPage = page ? +page : 1;

    let queryParams = {};
    if (search) {
      queryParams = { page: actualPage, search };
    } else {
      queryParams = { page: actualPage };
    }
    return await this.customerService.get(queryParams);
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
