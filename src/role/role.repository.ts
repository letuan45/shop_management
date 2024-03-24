import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: number) {
    return this.prisma.role.findUnique({ where: { id } });
  }
}
