import {
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
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AtAuthGuard } from 'src/auth/guards/at.guard';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async getUserCart(@Request() req: Express.Request) {
    const cartId = req.user['cartId'];
    return await this.cartService.getCart(cartId);
  }

  @Post('add-to-cart')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async addToCart(
    @Query('productId', ParseIntPipe) productId: number,
    @Query('quantity', ParseIntPipe) quantity: number,
    @Request() req: Express.Request,
  ) {
    const userCartId = req.user['cartId'];
    return await this.cartService.createCartItem(
      userCartId,
      productId,
      quantity,
    );
  }

  @Put('plus-one')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async plusOneCartItem(
    @Query('productId', ParseIntPipe) productId: number,
    @Request() req: Express.Request,
  ) {
    const userCartId = req.user['cartId'];
    return await this.cartService.plusOneCartItem(userCartId, productId);
  }

  @Put('minus-one')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async minusOneCartItem(
    @Query('productId', ParseIntPipe) productId: number,
    @Request() req: Express.Request,
  ) {
    const userCartId = req.user['cartId'];
    return await this.cartService.minusOneCartItem(userCartId, productId);
  }

  @Put('update-quantity')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async updateQuantityCartItem(
    @Query('productId', ParseIntPipe) productId: number,
    @Query('quantity', ParseIntPipe) quantity: number,
    @Request() req: Express.Request,
  ) {
    const userCartId = req.user['cartId'];
    return await this.cartService.updateCartItemQuantity(
      userCartId,
      productId,
      quantity,
    );
  }

  @Delete(':cartItemId')
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  async removeCartItem(@Param('cartItemId', ParseIntPipe) cartItemId: number) {
    return await this.cartService.deleteCartItem(cartItemId);
  }
}
