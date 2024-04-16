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
import { ReceiptService } from './receipt.service';
import {
  MakeReceiptOrderDto,
  ReceiptOrderItem,
} from './dtos/makeReceiptOrder.dto';
import { AtAuthGuard } from 'src/auth/guards/at.guard';
import { ReceiptQueryParamsDto } from './dtos/paramDto';
import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';

@ApiTags('Receipt')
@Controller('receipt')
@UseGuards(AtAuthGuard, AdminRoleGuard)
@ApiBearerAuth()
export class ReceiptController {
  constructor(private receiptService: ReceiptService) {}

  @Get('order')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'fromDate', required: false, type: Date })
  @ApiQuery({ name: 'toDate', required: false, type: Date })
  async getOrders(
    @Query('page') page?: number,
    @Query('fromDate') fromDate?: Date,
    @Query('toDate') toDate?: Date,
  ) {
    const actualPage = isNaN(page) ? 1 : page;
    let params: ReceiptQueryParamsDto = { page: actualPage };
    if (fromDate && toDate) {
      params = { page: actualPage, fromDate, toDate };
    } else if (fromDate) params = { page: actualPage, fromDate };
    else if (toDate) params = { page: actualPage, toDate };

    return await this.receiptService.getOrders(params);
  }

  @Get('bill')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'fromDate', required: false, type: Date })
  @ApiQuery({ name: 'toDate', required: false, type: Date })
  async getBill(
    @Query('page') page?: number,
    @Query('fromDate') fromDate?: Date,
    @Query('toDate') toDate?: Date,
  ) {
    const actualPage = isNaN(page) ? 1 : page;
    let params: ReceiptQueryParamsDto = { page: actualPage };
    if (fromDate && toDate) {
      params = { page: actualPage, fromDate, toDate };
    } else if (fromDate) params = { page: actualPage, fromDate };
    else if (toDate) params = { page: actualPage, toDate };

    return await this.receiptService.getBills(params);
  }

  @Get('bill/:billId')
  async getBillDetail(@Param('billId', ParseIntPipe) billId: number) {
    return await this.receiptService.getBillById(billId);
  }

  @Get('order/:orderId')
  async getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.receiptService.getOrderById(orderId);
  }

  @Post('order')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async makeOrder(
    @Body(ValidationPipe) makeReceiptOrderDto: MakeReceiptOrderDto,
    @Request() req: Express.Request,
  ) {
    const employeeId = req.user['employeeId'];

    return await this.receiptService.makeReceipt(
      employeeId,
      makeReceiptOrderDto,
    );
  }

  @Post('order/add-item')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async addItemToOrder(
    @Query('orderId', ParseIntPipe) orderId: number,
    @Body(ValidationPipe) receiptOrderItem: ReceiptOrderItem,
  ) {
    return await this.receiptService.addItemToOrder(orderId, receiptOrderItem);
  }

  @Put('order/plus-one-qty')
  async plusOneQtyOrderDetail(
    @Query('orderDetailId', ParseIntPipe) orderDetailId: number,
  ) {
    return await this.receiptService.plusOneQtyOrderDetail(orderDetailId);
  }

  @Put('order/minus-one-qty')
  async minusOneQtyOrderDetail(
    @Query('orderDetailId', ParseIntPipe) orderDetailId: number,
  ) {
    return await this.receiptService.minusOneQtyOrderDetail(orderDetailId);
  }

  @Put('order/update-qty')
  async updateQuantity(
    @Query('orderDetailId', ParseIntPipe) orderDetailId: number,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    return await this.receiptService.updateOrderDetailQuantity(
      orderDetailId,
      quantity,
    );
  }

  @Delete('order/delete-item')
  async deleteOrderDetail(
    @Query('orderDetailId', ParseIntPipe) orderDetailId: number,
  ) {
    return await this.receiptService.deleteOrderDetail(orderDetailId);
  }

  @Put('order/cancel')
  async cancelOrder(@Query('orderId', ParseIntPipe) orderId: number) {
    return await this.receiptService.cancelOrder(orderId);
  }

  @Post('bill/make-bill')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async makeBill(
    @Query('orderId', ParseIntPipe) orderId: number,
    @Request() req: Express.Request,
  ) {
    const employeeId = req.user['employeeId'];
    return await this.receiptService.makeBill(employeeId, orderId);
  }
}
