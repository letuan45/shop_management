import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeRepository } from './employee.repository';
import { EmployeeController } from './employee.controller';

@Module({
  providers: [EmployeeService, PrismaService, EmployeeRepository],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
