import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReceiptService } from './receipt.service';
import { MakeReceiptOrderDto } from './dtos/makeReceiptOrder.dto';
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

    return this.receiptService.makeReceipt(userId, makeReceiptOrderDto);
  }
}
