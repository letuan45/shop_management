import {
  Controller,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AtAuthGuard } from 'src/auth/guards/at.guard';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private cartSesvice: CartService) {}

  @Post('add-to-cart')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async addToCart(
    @Query('productId', ParseIntPipe) productId: number,
    @Query('quantity', ParseIntPipe) quantity: number,
    @Request() req: Express.Request,
  ) {
    return req.user;
  }
}
