import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import ConfigService from './shared/services/config.service';
import {BookModule} from "./book/book.module";
import {WinstonModule} from "nest-winston";
import * as winston from "winston";
import options from "./log.config";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ConfigService.getJwtSecret(),
      signOptions: { expiresIn: ConfigService.getJwtExpirationTime() },
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File(options.infoFile),
        new winston.transports.File(options.errorFile),
        new winston.transports.Console(),
      ],
      exitOnError: false,
    }),
    TypeOrmModule.forRoot(ConfigService.getTypeOrmConfig()),
    UserModule,
    AuthModule,
    BookModule
  ],
})
export class AppModule {}
