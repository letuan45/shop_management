import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';
import { GetSupplierQueryDto } from './dtos/getSupplierQuery.dto';

@Injectable()
export class SupplierService {
  constructor(@Inject('SUPPLIERS_SERVICE') private rabbitClient: ClientProxy) {}

  async getAll() {
    return this.rabbitClient.send({ cmd: 'get_all_supplier' }, {});
  }

  async get(queryParams: GetSupplierQueryDto) {
    const supplier = await lastValueFrom(
      this.rabbitClient.send({ cmd: 'get_supplier' }, queryParams),
    );
    return supplier;
  }

  async getById(supplierId: number) {
    return this.rabbitClient
      .send({ cmd: 'get_supplier_by_id' }, { id: supplierId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async create(createSupplierDto: CreateSupplierDto) {
    return this.rabbitClient
      .send({ cmd: 'create_supplier' }, createSupplierDto)
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async update(updateSupplierDto: UpdateSupplierDto) {
    return this.rabbitClient
      .send({ cmd: 'update_supplier' }, updateSupplierDto)
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }
}
