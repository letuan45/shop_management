import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReceiptService } from './receipt.service';
import {
  MakeReceiptOrderDto,
  ReceiptOrderItem,
} from './dtos/makeReceiptOrder.dto';
import { AtAuthGuard } from 'src/auth/guards/at.guard';

@ApiTags('Receipt')
@Controller('receipt')
export class ReceiptController {
  constructor(private receiptService: ReceiptService) {}

  @Post('order')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async makeOrder(
    @Body(ValidationPipe) makeReceiptOrderDto: MakeReceiptOrderDto,
    @Request() req: Express.Request,
  ) {
    const userId = req.user['id'];

    return await this.receiptService.makeReceipt(userId, makeReceiptOrderDto);
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

  @Delete('order/delete')
  async deleteOrderDetail(
    @Query('orderDetailId', ParseIntPipe) orderDetailId: number,
  ) {
    return await this.receiptService.deleteOrderDetail(orderDetailId);
  }
}
