import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtAuthGuard } from 'src/auth/guards/at.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //TODO: Bổ sung Guard Authorization admin
  @Post('/register')
  @ApiBody({ type: CreateUserDto })
  @UseGuards(AtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: CreateUserDto })
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Query('employeeId', ParseIntPipe) employeeId: number,
    @Query('roleId', ParseIntPipe) roleId: number,
  ) {
    await this.userService.createUser(createUserDto, employeeId, roleId);
    return { message: 'Tạo tài khoản cho nhân viên thành công' };
  }
}
