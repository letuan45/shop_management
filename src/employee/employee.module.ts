import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [EmployeeService, PrismaService],
})
export class EmployeeModule {}
