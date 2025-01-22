import { Injectable } from '@nestjs/common';
import { LoginResponseUsersDTO } from 'src/user/dto/login-response-user.dto';
// import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {CreateUsersDTO} from "../user/dto/create-user.dto";
import {JwtPayload} from "./jwt-payload.interface";
import {UserService} from "../user/user.service";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<LoginResponseUsersDTO | null> {
    const user = await this.userService.getByEmail(email);

    if (!user) return null;
    const validPassword = await bcrypt.compare(password, user.password);
    if (user && validPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data:CreateUsersDTO) {
    data.password = await bcrypt.hash(data.password, 10);
    const response = await this.userService.register(data);
    if (response) {
      const { password, ...result } = response;
      return result;
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  async getMe(user: JwtPayload) {
      return await this.userService.getById(user.sub);
  }
}
