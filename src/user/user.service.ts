import { ResetPasswordVerifyDto } from './dto/reset-pass-verify.dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/user.dto';
import { hash } from 'bcrypt';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { RoleRepository } from 'src/role/role.repository';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset-pass.dto';
import { CartService } from 'src/cart/cart.service';
import { CartRepository } from 'src/cart/cart.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private employeeRepository: EmployeeRepository,
    private cartRepository: CartRepository,
    private roleRepository: RoleRepository,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    employeeId: number,
    roleId: number,
  ) {
    const existUser = await this.userRepository.getByUsername(
      createUserDto.username,
    );
    if (existUser) throw new ConflictException('Tên tài khoản này đã đăng ký!');

    const existEmployee = await this.employeeRepository.getById(employeeId);
    if (!existEmployee) {
      throw new ConflictException('Không tìm thấy nhân viên!');
    }

    const usersAccount = await this.userRepository.getByEmployeeId(employeeId);
    if (usersAccount) {
      throw new ConflictException('Nhân viên này đã có tài khoản!');
    }

    const role = await this.roleRepository.getById(roleId);
    if (!role) {
      throw new ForbiddenException('Quyền tài khoản không khả dụng!');
    }

    createUserDto.password = await hash(createUserDto.password, 10);
    const newUser = await this.userRepository.create(
      createUserDto,
      existEmployee.id,
      role.id,
    );
    await this.cartRepository.create(newUser.id);

    return await this.userRepository.getById(newUser.id);
  }

  async getByUsername(username: string) {
    return await this.userRepository.getByUsername(username);
  }

  async resetPassword(resetPassDto: ResetPasswordVerifyDto) {
    const user = await this.userRepository.getByUsername(resetPassDto.username);
    const employee = await this.employeeRepository.getByEmail(
      resetPassDto.email,
    );

    if (!user || !employee) {
      throw new NotFoundException('Tên tài khoản hoặc email không đúng!');
    }

    if (user.employeeId !== employee.id) {
      throw new ConflictException(
        'Tên tài khoản và email không khớp với thông tin đã đăng ký!',
      );
    }

    // Passed all verify logic, generate token
    const salt = Math.random().toString(36).substring(7);
    const resetToken = this.jwtService.sign(
      { ...resetPassDto, salt },
      {
        expiresIn: '600s',
        secret: `${process.env.RESET_SECRET}`,
      },
    );

    const emailCtx = {
      to: resetPassDto.email,
      subject: 'Shop Manager [Khôi phục mật khẩu]',
      text: 'Đây là email khôi phục mật khẩu tài khoản dành cho bạn',
      html: `<div>
        <h1>Xin chào nhân viên ${employee.fullName},</h1>
        <h4>Chúng tôi đã nhận được yêu cầu khôi phục tài khoản qua phần mềm của chúng tôi, đây là email tự động dành cho bạn, hãy thực hiện theo chỉ dẫn từng bước</h4>
        <div>Truy cập đường dẫn sau để khôi phục mật khẩu: <a href="${process.env.FE_BASE_URL}/${process.env.API_BASE_PREFIX}/reset-password/${resetToken}">Đường dẫn đến trang khôi phục mật khẩu</a> </div>
        <p style="font-style: italic">Lưu ý: mã khôi phục chỉ có hiệu lực trong 10 phút</p>
      </div>`,
    };

    try {
      await this.emailService.sendEmail(
        emailCtx.to,
        emailCtx.subject,
        emailCtx.text,
        emailCtx.html,
      );

      // Set token
      await this.userRepository.changeUserResetPwToken(user.id, resetToken);

      return { message: 'Email khôi phục đã gửi đến nhân viên' };
    } catch (err) {
      throw err;
    }
  }

  async submitResetPassword(resetPassDto: ResetPasswordDto) {
    try {
      const decoded = await this.jwtService.verify(resetPassDto.resetToken, {
        secret: `${process.env.RESET_SECRET}`,
      });

      const username = decoded.username;
      const user = await this.userRepository.getByUsername(username);

      if (user.resetPwToken !== resetPassDto.resetToken) {
        throw new NotAcceptableException('Mã khôi phục không trùng khớp!');
      }

      const newPassword = await hash(resetPassDto.newPassword, 10);

      await this.userRepository.updatePasswordByUsername(
        user.username,
        newPassword,
      );

      await this.userRepository.removeUserResetPwToken(user.id);

      return { message: 'Mật khẩu đã thay đổi thành công!' };
    } catch (error) {
      let message = 'Đã xảy ra lỗi khi xác thực!';
      if (error?.message) {
        message = error.message;
      }
      if (error?.message.includes('expired')) {
        message = 'Mã khôi phục hết hạn!';
      }
      throw new NotAcceptableException(message);
    }
  }
}
