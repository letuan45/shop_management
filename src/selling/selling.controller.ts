import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SellingService } from './selling.service';
import { AtAuthGuard } from 'src/auth/guards/at.guard';
import { SellingOrderItem } from './dtos/sellingOrder.dto';
import { SellingQueryParamsDto } from './dtos/paramDto';
import { ReceiptQueryParamsDto } from 'src/receipt/dtos/paramDto';

@ApiTags('Selling')
@Controller('selling')
@UseGuards(AtAuthGuard)
@ApiBearerAuth()
export class SellingController {
  constructor(private sellingService: SellingService) {}

  @Get('order')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'fromDate', required: false, type: Date })
  @ApiQuery({ name: 'toDate', required: false, type: Date })
  async getOrders(
    @Request() req: Express.Request,
    @Query('page') page?: number,
    @Query('fromDate') fromDate?: Date,
    @Query('toDate') toDate?: Date,
  ) {
    const actualPage = isNaN(page) ? 1 : page;
    let params: SellingQueryParamsDto = {
      page: actualPage,
    };
    if (fromDate && toDate) {
      params = { page: actualPage, fromDate, toDate };
    } else if (fromDate) params = { page: actualPage, fromDate };
    else if (toDate) params = { page: actualPage, toDate };

    if (req.user['roleId'] === 1) {
      const employeeId = req.user['employeeId'];
      params = { ...params, employeeId };
    }

    return await this.sellingService.getOrders(params);
  }

  @Get('order/:orderId')
  async getOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.sellingService.getOrder(orderId);
  }

  @Get('bill')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'fromDate', required: false, type: Date })
  @ApiQuery({ name: 'toDate', required: false, type: Date })
  async getBillds(
    @Request() req: Express.Request,
    @Query('page') page?: number,
    @Query('fromDate') fromDate?: Date,
    @Query('toDate') toDate?: Date,
  ) {
    const actualPage = isNaN(page) ? 1 : page;
    let params: SellingQueryParamsDto = { page: actualPage };
    if (fromDate && toDate) {
      params = { page: actualPage, fromDate, toDate };
    } else if (fromDate) params = { page: actualPage, fromDate };
    else if (toDate) params = { page: actualPage, toDate };

    if (req.user['roleId'] === 1) {
      const employeeId = req.user['employeeId'];
      params = { ...params, employeeId };
    }

    return await this.sellingService.getBills(params);
  }

  @Get('bill/:billId')
  async getBill(@Param('billId', ParseIntPipe) billId: number) {
    return await this.sellingService.getBill(billId);
  }

  @Post('create')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'customerId', required: false })
  async makeOrder(
    @Request() req: Express.Request,
    @Query('customerId') customerId?: number,
  ) {
    const employeeId = req.user['employeeId'];
    const cartId = req.user['cartId'];

    return await this.sellingService.makeOrder(employeeId, cartId, customerId);
  }

  @Put('order/change-customer')
  @ApiQuery({ name: 'customerId', required: false })
  async changeOrderCustomer(
    @Query('orderId', ParseIntPipe) orderId: number,
    @Query('customerId') customerId?: number,
  ) {
    return await this.sellingService.changeCustomer(orderId, customerId);
  }

  @Post('order/add-item')
  async addOrderDetail(
    @Query('orderId', ParseIntPipe) orderId: number,
    @Body(ValidationPipe) sellingOrderItem: SellingOrderItem,
  ) {
    return await this.sellingService.addOrderDetail(orderId, sellingOrderItem);
  }

  @Put('order/plus-one-qty')
  async plusOneQtyOrderDetail(
    @Query('orderDetailId', ParseIntPipe) orderDetailId: number,
  ) {
    return await this.sellingService.plusOneQtyOrderDetail(orderDetailId);
  }

  @Put('order/minus-one-qty')
  async minusOneQtyOrderDetail(
    @Query('orderDetailId', ParseIntPipe) orderDetailId: number,
  ) {
    return await this.sellingService.minusOneQtyOrderDetail(orderDetailId);
  }

  @Put('order/update-qty')
  async updateQuantity(
    @Query('orderDetailId', ParseIntPipe) orderDetailId: number,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    return await this.sellingService.updateOrderDetailQuantity(
      orderDetailId,
      quantity,
    );
  }

  @Delete('order/delete-item')
  async deleteOrderDetail(
    @Query('orderDetailId', ParseIntPipe) orderDetailId: number,
  ) {
    return await this.sellingService.deleteOrderDetail(orderDetailId);
  }

  @Put('order/cancel')
  async cancelOrder(@Query('orderId', ParseIntPipe) orderId: number) {
    return await this.sellingService.cancelOrder(orderId);
  }

  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  @Post('bill/make-bill')
  async makeBill(
    @Query('orderId', ParseIntPipe) orderId: number,
    @Query('customerPayment', ParseIntPipe) customerPayment: number,
    @Request() req: Express.Request,
  ) {
    const employeeId = req.user['employeeId'];

    return await this.sellingService.makeBill(
      employeeId,
      orderId,
      customerPayment,
    );
  }
}
