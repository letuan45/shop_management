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
  ) {
    return await this.prisma.employee.create({
      data: { fullName, phone, email, address, image },
    });
  }

  async getById(id: number) {
    return await this.prisma.employee.findUnique({ where: { id } });
  }
}
