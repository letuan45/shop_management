import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { CreateProductDto } from './dtos/createProduct.dto';
import { CreateProductResponseDto } from './dtos/createProductRes.dto';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { UpdateProductResponseDto } from './dtos/updateProductRes.dto';
import { Response } from 'express';
import { AtAuthGuard } from 'src/auth/guards/at.guard';
import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  // @UseGuards(AtAuthGuard, AdminRoleGuard)
  // @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'pageSize', required: false, type: String })
  @ApiQuery({ name: 'isForSell', required: false, type: Boolean })
  async getAll(
    @Query('page') page?: number,
    @Query('search') search?: string,
    @Query('pageSize') pageSize?: number,
    @Query('isForSell') isForSell?: boolean,
  ) {
    const actualPage = page ? +page : 1;

    let queryParams = {};
    if (search) {
      queryParams = { page: actualPage, search };
    } else {
      queryParams = { page: actualPage };
    }

    if (pageSize) {
      queryParams = { ...queryParams, pageSize };
    }

    if (isForSell) {
      queryParams = { ...queryParams, isForSell };
    }

    return this.productService.get(queryParams);
  }

  @Get('image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads/products' });
  }

  @Get(':productId')
  @UseGuards(AtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth()
  async getProduct(@Param('productId', ParseIntPipe) productId: number) {
    return await this.productService.getProduct(productId);
  }

  @Post('create')
  @UseGuards(AtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: CreateProductResponseDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtenson = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtenson;

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.productService.create(createProductDto, file);
  }

  @Put('update/:productId')
  @ApiResponse({ type: UpdateProductResponseDto })
  @UseGuards(AtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtenson = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtenson;

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  async update(
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.productService.update(productId, updateProductDto, file);
  }
}
