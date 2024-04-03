import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateCustomerDto } from './dtos/createCustomer.dto';
import { catchError, throwError } from 'rxjs';
import { CustomerQueryParamsDto } from './dtos/paramDto';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CUSTOMERS_SERVICE') private rabbitCustomerClient: ClientProxy,
  ) {}

  async get(queryParam: CustomerQueryParamsDto) {
    return this.rabbitCustomerClient.send({ cmd: 'get_customers' }, queryParam);
  }

  async getCustomer(customerId: number) {
    return this.rabbitCustomerClient
      .send({ cmd: 'get_customer' }, { id: customerId })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  async create(createCustomerDto: CreateCustomerDto) {
    return this.rabbitCustomerClient.send(
      { cmd: 'create_customer' },
      createCustomerDto,
    );
  }

  async update(id: number, createCustomerDto: CreateCustomerDto) {
    return this.rabbitCustomerClient
      .send({ cmd: 'update_customer' }, { ...createCustomerDto, id })
      .pipe(
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }
}
