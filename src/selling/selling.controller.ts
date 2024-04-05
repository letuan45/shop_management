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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SellingService } from './selling.service';
import { AtAuthGuard } from 'src/auth/guards/at.guard';
import { SellingOrderItem } from './dtos/sellingOrder.dto';
import { SellingQueryParamsDto } from './dtos/paramDto';

@ApiTags('Selling')
@Controller('selling')
export class SellingController {
  constructor(private sellingService: SellingService) {}

  @Get('order')
  async getOrders(@Query() queryParam: SellingQueryParamsDto) {
    queryParam.page = queryParam.page ? +queryParam.page : 1;
    return await this.sellingService.getOrders(queryParam);
  }

  @Get('order/:orderId')
  async getOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.sellingService.getOrder(orderId);
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
