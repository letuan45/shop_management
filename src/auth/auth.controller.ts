import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local.guard';
import { UserPayload } from './dto/userPayload.dto';
import { RtAuthGuard } from './guards/rt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    const userPayload: UserPayload = this.getPayload(req);
    return this.authService.login(userPayload);
  }

  @Get('refresh')
  @UseGuards(RtAuthGuard)
  @ApiBearerAuth()
  async refreshToken(@Request() req) {
    const userPayload: UserPayload = this.getPayload(req);

    return this.authService.refreshAccessToken(userPayload);
  }

  @Get('logout')
  @UseGuards(RtAuthGuard)
  @ApiBearerAuth()
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  getPayload(reqPayload): UserPayload {
    return {
      id: reqPayload.user.id,
      username: reqPayload.user.username,
      isActive: reqPayload.user.isActive,
      roleId: reqPayload.user.roleId,
      employeeId: reqPayload.user.employeeId,
      cartItems: reqPayload.user.cartItems,
    };
  }
}
