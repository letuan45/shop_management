import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  constructor(@Inject('PRODUCTS_SERVICE') private client: ClientProxy) {}

  @Get()
  async getAll() {
    this.client.emit('test', { status: 'ok', message: 'hello' });
    return 'sent';
  }
}
