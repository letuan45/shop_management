import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtAuthGuard } from 'src/auth/guards/at.guard';
import { ResetPasswordVerifyDto } from './dto/reset-pass-verify.dto';
import { ResetPasswordDto } from './dto/reset-pass.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('roles')
  async getAllRoles() {
    return await this.userService.getAllRoles();
  }

  //TODO: Bổ sung Guard Authorization admin
  @Post('register')
  // @UseGuards(AtAuthGuard)
  // @ApiBearerAuth()
  @ApiResponse({ type: CreateUserDto })
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Query('employeeId', ParseIntPipe) employeeId: number,
    @Query('roleId', ParseIntPipe) roleId: number,
  ) {
    await this.userService.createUser(createUserDto, employeeId, roleId);
    return { message: 'Tạo tài khoản cho nhân viên thành công' };
  }

  @Get(':userId')
  async getAccountInfo(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.getAccountInfo(userId);
  }

  @Put('update')
  async updateAccount(
    @Query('userId', ParseIntPipe) userId: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordVerifyDto })
  async resetPassword(
    @Body(ValidationPipe) resetPassDto: ResetPasswordVerifyDto,
  ) {
    return await this.userService.resetPassword(resetPassDto);
  }

  @Post('confirm-reset-password')
  @ApiBody({ type: ResetPasswordDto })
  async confirmResetPassword(
    @Body(ValidationPipe) resetPassDto: ResetPasswordDto,
  ) {
    return await this.userService.submitResetPassword(resetPassDto);
  }
}
