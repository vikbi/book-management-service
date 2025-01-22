import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import * as dotenv from 'dotenv';
// import { RedisCacheModule } from 'src/cache/cache.module';
import { AuthController } from './auth.controller';
// import { WinstonModule } from 'nest-winston';
import {jwtConstants} from "./constants";
// import {WinstonModule} from "nest-winston";
import {UserModule} from "../user/user.module";
// import {UserService} from "../user/user.service";

dotenv.config();

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiry },
    }),
    // WinstonModule.forRoot({
    //   // Winston configuration
    // }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
