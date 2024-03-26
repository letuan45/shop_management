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
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(
    private employeeRepository: EmployeeRepository,
    private prisma: PrismaService,
  ) {}
  private pageLimit = 4;

  async getEmployees(page: number, search?: string) {
    const skip = this.pageLimit * (page - 1);
    let where = {};
    if (search) {
      where = {
        OR: [
          { fullName: { contains: search } },
          { phone: { contains: search } },
          { email: { contains: search } },
        ],
      };
    }

    const data = await this.prisma.employee.findMany({
      take: this.pageLimit,
      skip: skip,
      where: where,
      orderBy: { id: 'desc' },
    });

    const count = await this.prisma.employee.count({ where: where });

    return {
      data,
      total: count,
    };
  }

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

    if (await this.employeeRepository.getByEmail(createEmployeeDto.email)) {
      await this.deleteFile(image.path);
      throw new ConflictException('Email này đã tồn tại!');
    }

    if (await this.employeeRepository.getByPhone(createEmployeeDto.phone)) {
      await this.deleteFile(image.path);
      throw new ConflictException('Số điện thoại này đã tồn tại!');
    }

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

    if (
      (await this.employeeRepository.getByEmail(updateEmployeeDto.email)) &&
      employee.email !== updateEmployeeDto.email
    ) {
      if (image) {
        await this.deleteFile(image.path);
      }
      throw new ConflictException('Email này đã tồn tại!');
    }

    if (
      (await this.employeeRepository.getByPhone(updateEmployeeDto.phone)) &&
      employee.phone !== updateEmployeeDto.phone
    ) {
      if (image) {
        await this.deleteFile(image.path);
      }
      throw new ConflictException('Số điện thoại này đã tồn tại!');
    }

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

  async getEmployee(employeeId: number) {
    return this.employeeRepository.getById(employeeId);
  }

  async deleteFile(filePath: string) {
    const unlink = util.promisify(fs.unlink);

    try {
      await unlink(filePath);
    } catch (error) {
      throw error;
    }
  }
}
