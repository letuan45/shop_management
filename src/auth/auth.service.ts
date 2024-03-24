import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginDto) {
    const userData = await this.validateUser(loginDto);

    const payload = {
      user: userData,
    };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException();
    } else if (await compare(loginDto.password, user.password)) {
      const { password, ...userPayload } = user;
      return userPayload;
    }

    return null;
  }
}
