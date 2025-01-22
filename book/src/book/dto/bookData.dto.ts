import {ApiProperty} from "@nestjs/swagger";
import {IsAlphanumeric, IsInt, IsPositive, IsString, MaxLength} from "class-validator";
import {BooksEntity} from "../entities/books.entity";

export class BookDataDto {
    @ApiProperty()
    @IsInt()
    @IsPositive()
    id: number;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    author: string;

    @ApiProperty()
    @IsString()
    genre: string;

    @ApiProperty()
    @IsString()
    thumbnail: string;

    @ApiProperty()
    @IsString()
    created_at: Date;

    @ApiProperty()
    @IsString()
    published_at: Date;
}

export class BookDataResponseDto {
    @ApiProperty()
    data: BooksEntity[];

    @ApiProperty()
    @IsInt()
    total: number;

    @ApiProperty()
    @IsInt()
    page: number;

    @ApiProperty()
    @IsInt()
    limit: number;
}