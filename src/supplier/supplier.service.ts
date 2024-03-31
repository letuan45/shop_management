import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { catchError, throwError } from 'rxjs';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';

@Injectable()
export class SupplierService {
  constructor(@Inject('SUPPLIERS_SERVICE') private rabbitClient: ClientProxy) {}

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
