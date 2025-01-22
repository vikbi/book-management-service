import { BaseUsersDTO } from './base-user.dto';
import {ApiProperty} from "@nestjs/swagger";
import {IsAlphanumeric, IsString, MaxLength} from "class-validator";
import {Optional} from "@nestjs/common";

export class CreateUsersDTO extends BaseUsersDTO {
    @ApiProperty()
    @IsString()
    @MaxLength(25)
    @Optional()
    name: string;
}
