import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { RoleRepository } from 'src/role/role.repository';

@Module({
  providers: [
    UserService,
    PrismaService,
    UserRepository,
    EmployeeRepository,
    RoleRepository,
  ],
  controllers: [UserController],
})
export class UserModule {}