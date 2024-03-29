import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { RoleRepository } from 'src/role/role.repository';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { CartRepository } from 'src/cart/cart.repository';

@Module({
  providers: [
    UserService,
    CartRepository,
    PrismaService,
    UserRepository,
    EmployeeRepository,
    RoleRepository,
    JwtService,
    EmailService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
