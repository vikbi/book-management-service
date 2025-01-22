import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";
import {Optional} from "@nestjs/common";

export class BookUpdateDataDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    author: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    genre: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    thumbnail: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    published_at: Date;
}