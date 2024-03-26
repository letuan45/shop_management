import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { CreateEmployeeDto } from './dto/createEmployee.dto';

@Injectable()
export class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Only image file is alowed!');
    }
    const filePath = `${process.env.BASE_URL}/employee/image/${image.filename}`;
    return await this.employeeRepository.create(
      createEmployeeDto.fullName,
      createEmployeeDto.phone,
      createEmployeeDto.email,
      createEmployeeDto.address,
      filePath,
    );
  }
}
