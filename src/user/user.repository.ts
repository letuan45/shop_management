import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    employeeId: number,
    roleId: number,
  ) {
    return await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password,
        employeeId,
        roleId,
      },
    });
  }

  async getByUsername(username: string) {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async getById(userId: number) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getByEmployeeId(employeeId: number) {
    return await this.prisma.user.findUnique({ where: { employeeId } });
  }
}
