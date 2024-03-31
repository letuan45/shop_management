import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { UserPayload } from './dto/userPayload.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(userPayload: UserPayload) {
    // Get more information
    const newPayload = await this.getMorePayloadData(userPayload);

    const refreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '7d',
      secret: `${process.env.RT_SECRET}`,
    });

    // Assign Refresh Token to database
    await this.prisma.user.update({
      where: { id: userPayload.id },
      data: { refreshToken },
    });

    return {
      ...newPayload,
      accessToken: this.jwtService.sign(newPayload),
      refreshToken,
    };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Đăng xuất thành công' };
  }

  async validateUser(username: string, password: string): Promise<UserPayload> {
    const user = await this.userService.getByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    } else if (await compare(password, user.password)) {
      const cartItems = await this.prisma.cartItem.findMany({
        where: {
          cartId: user.cart.id,
        },
      });
      const { password, ...result } = user;
      return { ...result, cartItems, cartId: user.cart.id };
    }

    return null;
  }

  async refreshAccessToken(userPayload: UserPayload) {
    const newPayload = await this.getMorePayloadData(userPayload);

    return {
      accessToken: this.jwtService.sign(newPayload),
    };
  }

  async getMorePayloadData(userPayload: UserPayload) {
    const { fullName, email, image } = await this.prisma.employee.findUnique({
      where: { id: userPayload.employeeId },
    });

    return { ...userPayload, fullName, email, image };
  }
}
