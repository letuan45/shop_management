import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { CreateEmployeeDto } from './dto/createEmployee.dto';

import * as fs from 'fs';
import * as util from 'util';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';

@Injectable()
export class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    image: Express.Multer.File,
  ) {
    if (!image) {
      await this.deleteFile(image.path);
      throw new BadRequestException('Only image file is alowed!');
    }
    const filePath = `${process.env.BASE_URL}/employee/image/${image.filename}`;
    const dateOfBirth = new Date(createEmployeeDto.dateOfBirth);

    this.checkUniqueValues(
      createEmployeeDto.email,
      createEmployeeDto.phone,
      image,
    );

    return await this.employeeRepository.create(
      createEmployeeDto.fullName,
      createEmployeeDto.phone,
      createEmployeeDto.email,
      createEmployeeDto.address,
      filePath,
      dateOfBirth,
    );
  }

  async update(
    employeeId: number,
    updateEmployeeDto: UpdateEmployeeDto,
    image?: Express.Multer.File,
  ) {
    const employee = await this.employeeRepository.getById(employeeId);

    if (!employee) {
      if (image) {
        await this.deleteFile(image.path);
      }
      throw new NotFoundException('Không tìm thấy nhân viên!');
    }

    let updateImage;
    if (image) {
      const filenameArr = employee.image.split('/');
      const filename = filenameArr[filenameArr.length - 1];
      await this.deleteFile(`./uploads/employees/${filename}`);
      updateImage = `${process.env.BASE_URL}/employee/image/${image.filename}`;
    } else {
      updateImage = employee.image;
    }

    this.checkValid(
      employee.email,
      updateEmployeeDto.email,
      employee.phone,
      updateEmployeeDto.phone,
      image,
    );

    const dateOfBirth = new Date(updateEmployeeDto.dateOfBirth);

    return await this.employeeRepository.updateById(
      employeeId,
      updateEmployeeDto.fullName,
      updateEmployeeDto.phone,
      updateEmployeeDto.email,
      updateEmployeeDto.address,
      updateImage,
      dateOfBirth,
      `${updateEmployeeDto.isWorking}` === 'true',
    );
  }

  async deleteFile(filePath: string) {
    const unlink = util.promisify(fs.unlink);

    try {
      await unlink(filePath);
    } catch (error) {
      throw error;
    }
  }

  async checkUniqueValues(
    email: string,
    phone: string,
    image: Express.Multer.File,
  ) {
    if (await this.employeeRepository.getByEmail(email)) {
      await this.deleteFile(image.path);
      throw new ConflictException('Email này đã tồn tại!');
    }

    if (await this.employeeRepository.getByPhone(phone)) {
      await this.deleteFile(image.path);
      throw new ConflictException('Số điện thoại này đã tồn tại!');
    }
  }

  async checkValid(
    dbEmail: string,
    email: string,
    dbPhone: string,
    phone: string,
    image?: Express.Multer.File,
  ) {
    if (
      (await this.employeeRepository.getByEmail(email)) &&
      dbEmail !== email
    ) {
      if (image) {
        await this.deleteFile(image.path);
      }
      throw new ConflictException('Email này đã tồn tại!');
    }

    if (
      (await this.employeeRepository.getByPhone(phone)) &&
      dbPhone !== phone
    ) {
      if (image) {
        await this.deleteFile(image.path);
      }
      throw new ConflictException('Số điện thoại này đã tồn tại!');
    }
  }
}
