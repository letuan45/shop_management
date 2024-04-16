import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategies/at.strategy';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.stategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: `${process.env.AT_SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    LocalStrategy,
    PrismaService,
    AtStrategy,
    RtStrategy,
  ],
})
export class AuthModule {}
