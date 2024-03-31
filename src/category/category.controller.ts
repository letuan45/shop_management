import { CreateCategoryResponseDto } from './dtos/createCategoryRes.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError, timeout } from 'rxjs';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    @Inject('PRODUCTS_CATE_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  @Get()
  async getAll() {
    return this.rabbitClient
      .send({ cmd: 'get_all_cate' }, {})
      .pipe(timeout(5000));
  }

  @Post('create')
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ type: CreateCategoryResponseDto })
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.rabbitClient
      .send({ cmd: 'create_cate' }, createCategoryDto)
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  @Put('update/:cateId')
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ type: CreateCategoryResponseDto })
  async update(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
    @Param('cateId', ParseIntPipe) cateId: number,
  ) {
    return this.rabbitClient
      .send({ cmd: 'update_cate' }, { id: cateId, ...createCategoryDto })
      .pipe(timeout(5000));
  }

  @Delete('delete/:cateId')
  async delete(@Param('cateId', ParseIntPipe) cateId: number) {
    return this.rabbitClient.send({ cmd: 'delete_cate' }, { id: cateId }).pipe(
      catchError((error) => {
        return throwError(() => new RpcException(error.response));
      }),
    );
  }
}
