import { Injectable } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/';
import { loginAuthDto } from './dto/login.dto';
import { LoginService } from './services/login';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly loginService: LoginService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.registerUser(createUserDto);
  }

  async loginUser({
    email,
    password,
  }: loginAuthDto): Promise<{ access_token: string }> {
    return await this.loginService.login(email, password);
  }
}
