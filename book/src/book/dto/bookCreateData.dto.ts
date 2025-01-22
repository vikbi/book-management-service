import {ApiProperty} from "@nestjs/swagger";
import {IsAlphanumeric, IsInt, IsNumber, IsPositive, IsString, MaxLength} from "class-validator";

export class BookCreateDataDto {

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    author: string;

    @ApiProperty()
    @IsNumber()
    genre: string;

    @ApiProperty()
    @IsString()
    thumbnail: string;

    @ApiProperty()
    @IsString()
    published_at: string;
}