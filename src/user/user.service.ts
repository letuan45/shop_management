import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/user.dto';
import { hash } from 'bcrypt';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { RoleRepository } from 'src/role/role.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private employeeRepository: EmployeeRepository,
    private roleRepository: RoleRepository,
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
    return await this.userRepository.create(
      createUserDto,
      existEmployee.id,
      role.id,
    );
  }

  async getByUsername(username: string) {
    return await this.userRepository.getByUsername(username);
  }
}
