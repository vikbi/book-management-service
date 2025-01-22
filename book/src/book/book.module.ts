import { Module } from '@nestjs/common';
import {BookService} from "./book.service";
import {BookController} from "./book.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BooksEntity} from "./entities/books.entity";
import {WinstonModule} from "nest-winston";
import * as winston from "winston";
import {JwtService} from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([BooksEntity]),
        WinstonModule.forRoot({
            transports: [
                new winston.transports.Console(),
            ],
        }),],
    providers: [BookService, JwtService],
    controllers: [BookController],
    exports: [BookService]
})
export class BookModule {}
