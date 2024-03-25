import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const role = await this.prisma.role.findUnique({
      where: { id: request.user.roleId },
    });

    if (role.name !== 'ADMIN') {
      return false;
    }
    return true;
  }
}
