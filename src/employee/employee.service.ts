import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { CreateEmployeeDto } from './dto/createEmployee.dto';

@Injectable()
export class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  allowedMimetype = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png'];

  async create(
    createEmployeeDto: CreateEmployeeDto,
    image: Express.Multer.File,
  ) {
    if (!this.allowedMimetype.includes(image.mimetype)) {
      throw new BadRequestException('Only image file is allowed!');
    }
    console.log(image);
    return 'ok bro';
  }
}
