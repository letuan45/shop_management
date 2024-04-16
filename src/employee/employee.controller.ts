import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { CreateEmployeeResponseDto } from './dto/createEmployeeResponse.dto';
// import { AtAuthGuard } from 'src/auth/guards/at.guard';
// import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';
import { EmployeeQueryParamsDto } from './dto/paramDto';

@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get('')
  async getEmployees(@Query() params: EmployeeQueryParamsDto) {
    const page = params.page ? +params.page : 1;
    return await this.employeeService.getEmployees(page, params.search);
  }

  @Get(':employeeId')
  @ApiResponse({ type: CreateEmployeeResponseDto })
  async getEmployee(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.employeeService.getEmployee(employeeId);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/employees',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtenson = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtenson;

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  @Post('create')
  @ApiResponse({ type: CreateEmployeeResponseDto })
  @ApiConsumes('multipart/form-data')
  async createEmployee(
    @Body(ValidationPipe) createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.employeeService.create(createEmployeeDto, file);
  }

  @Get('image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads/employees' });
  }

  @Put('update/:employeeId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/employees',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtenson = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtenson;

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  async updateEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body(ValidationPipe) updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.employeeService.update(
      employeeId,
      updateEmployeeDto,
      file,
    );
  }
}
