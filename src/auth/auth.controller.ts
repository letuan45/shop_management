import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  async login() {
    return 'Login';
  }
}
