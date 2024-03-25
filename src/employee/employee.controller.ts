import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createEmployee(
    @Body(ValidationPipe) createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.employeeService.create(createEmployeeDto, file);
  }
}
