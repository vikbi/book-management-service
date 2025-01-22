import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsAlphanumeric, MaxLength, IsEmail} from 'class-validator';

export class LoginUsersDTO {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsAlphanumeric()
  @MaxLength(25)
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
