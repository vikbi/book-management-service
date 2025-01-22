import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginUsersDTO } from './dto/login-user.dto';
import { UsersDTO } from '../user/dto/users.dto';
import { ResponseTokenDTO } from './dto/response-token.dto';
import { UnauthorizedDTO } from './dto/unauthorized.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {LocalAuthGuard} from './local-auth.guard';
import {AuthGuard} from "./auth.guard";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ApiTags('auth')
  @UseGuards(LocalAuthGuard)
  @ApiUnauthorizedResponse({ type: UnauthorizedDTO })
  @ApiOkResponse({ type: ResponseTokenDTO })
  @ApiBody({ type: LoginUsersDTO })
  @Post('login')
  async login(@Request() req: any): Promise<any> {
    const data = await this.authService.login(req.user);
    this.logger.info('get access token', { data: data });
    return data;
  }

  @ApiTags('profile')
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({ type: UnauthorizedDTO })
  @ApiOkResponse({ type: UsersDTO })
  @ApiBearerAuth()
  @Get('me')
  async getMe(@Request() req: any): Promise<any> {
    const user = await req.user;
    const userData = await this.authService.getMe(user);
    this.logger.info('get user info', { data: user });
    return userData;
  }
}
