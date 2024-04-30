import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    fullName: string,
    phone: string,
    email: string,
    address: string,
    image: string,
    dateOfBirth: Date,
  ) {
    return await this.prisma.employee.create({
      data: { fullName, phone, email, address, image, dateOfBirth },
    });
  }

  async updateById(
    employeeId: number,
    fullName: string,
    phone: string,
    email: string,
    address: string,
    image: string,
    dateOfBirth: Date,
    isWorking: boolean,
  ) {
    return await this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        fullName,
        phone,
        email,
        address,
        image,
        dateOfBirth,
        isWorking,
      },
    });
  }

  async getById(id: number) {
    return await this.prisma.employee.findUnique({ where: { id }});
  }

  async getByPhone(phone: string) {
    return await this.prisma.employee.findUnique({ where: { phone } });
  }

  async getByEmail(email: string) {
    return await this.prisma.employee.findUnique({ where: { email } });
  }
}
