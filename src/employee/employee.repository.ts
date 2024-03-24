import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: number) {
    return await this.prisma.employee.findUnique({ where: { id } });
  }
}
