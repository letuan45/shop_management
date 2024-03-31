import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateProductDto } from './dtos/createProduct.dto';

import * as fs from 'fs';
import * as util from 'util';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ProductQueryParamDto } from './dtos/productQueryParam.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(@Inject('PRODUCTS_SERVICE') private rabbitClient: ClientProxy) {}

  async get(queryParams: ProductQueryParamDto) {
    const product = await lastValueFrom(
      this.rabbitClient.send({ cmd: 'get_product' }, queryParams),
    );
    return product;
  }

  async getProduct(productId: number) {
    return this.rabbitClient
      .send({ cmd: 'get_product_by_id' }, { id: productId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async create(createProductDto: CreateProductDto, image: Express.Multer.File) {
    const category = await lastValueFrom(
      this.rabbitClient.send(
        { cmd: 'get_cate' },
        { id: +createProductDto.categoryId },
      ),
    );
    if (!category) {
      this.deleteFile(image.path);
      throw new ConflictException('Không tìm thấy danh mục sản phẩm!');
    }

    if (+createProductDto.importPrice >= +createProductDto.exportPrice) {
      this.deleteFile(image.path);
      throw new ConflictException('Giá nhập không thể cao hơn giá bán');
    }

    const filePath = `${process.env.BASE_URL}/${process.env.API_BASE_PREFIX}/product/image/${image.filename}`;

    const data = {
      name: createProductDto.name,
      image: filePath,
      importPrice: +createProductDto.importPrice,
      exportPrice: +createProductDto.exportPrice,
      discount: +createProductDto.discount,
      categoryId: +createProductDto.categoryId,
    };

    return this.rabbitClient.send({ cmd: 'create_product' }, data);
  }

  async update(
    productId: number,
    updateProductDto: UpdateProductDto,
    image: Express.Multer.File,
  ) {
    const product = await lastValueFrom(
      this.rabbitClient.send({ cmd: 'get_product_by_id' }, { id: productId }),
    );

    if (!product) {
      if (image) {
        this.deleteFile(image.path);
      }
      throw new ConflictException('Không tìm thấy sản phẩm!');
    }

    const category = await lastValueFrom(
      this.rabbitClient.send(
        { cmd: 'get_cate' },
        { id: +updateProductDto.cateId },
      ),
    );
    if (!category) {
      if (image) {
        this.deleteFile(image.path);
      }
      throw new ConflictException('Không tìm thấy danh mục sản phẩm!');
    }

    if (+updateProductDto.importPrice >= +updateProductDto.exportPrice) {
      if (image) {
        this.deleteFile(image.path);
      }
      throw new ConflictException('Giá nhập không thể cao hơn giá bán');
    }

    let updateImage = '';
    if (image) {
      const filenameArr = product.image.split('/');
      const filename = filenameArr[filenameArr.length - 1];
      await this.deleteFile(`./uploads/products/${filename}`);

      updateImage = `${process.env.BASE_URL}/${process.env.API_BASE_PREFIX}/product/image/${image.filename}`;
    } else {
      updateImage = product.image;
    }

    const data = {
      id: +productId,
      name: updateProductDto.name,
      image: updateImage,
      status: +updateProductDto.status,
      importPrice: +updateProductDto.importPrice,
      exportPrice: +updateProductDto.exportPrice,
      discount: +updateProductDto.discount,
      categoryId: +updateProductDto.cateId,
    };

    return this.rabbitClient.send({ cmd: 'update_product' }, data).pipe(
      catchError((error) => {
        return throwError(() => new RpcException(error.response));
      }),
    );
  }

  async deleteFile(filePath: string) {
    const unlink = util.promisify(fs.unlink);

    try {
      //   if (fs.existsSync(filePath)) {
      await unlink(filePath);
      //   }
    } catch (error) {
      throw error;
    }
  }
}
