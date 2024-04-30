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
    return await this.prisma.user.findUnique({
      where: { username: username },
      include: { cart: true },
    });
  }

  async getById(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
  }

  async getByEmployeeId(employeeId: number) {
    return await this.prisma.user.findUnique({ where: { employeeId } });
  }

  async updateAccount(
    id: number,
    password: string,
    roleId: number,
    isActive: boolean,
  ) {
    return await this.prisma.user.update({
      where: { id },
      data: { password, roleId, isActive },
    });
  }

  async updatePasswordByUsername(username: string, password: string) {
    return await this.prisma.user.update({
      where: { username },
      data: { password },
    });
  }

  async changeUserResetPwToken(userId: number, token: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetPwToken: token,
      },
    });
  }

  async removeUserResetPwToken(userId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetPwToken: null,
      },
    });
  }
}
