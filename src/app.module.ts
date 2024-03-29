import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeeModule } from './employee/employee.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
@Module({
  imports: [
    PrismaModule,
    EmployeeModule,
    UserModule,
    AuthModule,
    RoleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
    CartModule,
    ProductModule,
  ],
})
export class AppModule {}
