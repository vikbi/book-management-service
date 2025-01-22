import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsAlphanumeric, MaxLength, IsEmail} from 'class-validator';

export class BaseUsersDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(25)
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
