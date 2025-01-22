import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsPositive, IsString} from "class-validator";

export class getBooksDto {
    @ApiProperty()
    @IsInt()
    @IsPositive()
    page: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    limit: number;

    @ApiProperty()
    @IsString()
    sortBy: string;

    @ApiProperty()
    @IsString()
    order: string;

    @ApiProperty()
    filter: any;
}