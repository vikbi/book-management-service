import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    Request,
    UseGuards
} from "@nestjs/common";
import {ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthGuard} from "../auth/auth.guard";
import {BookService} from "./book.service";
import {UnauthorizedDTO} from "../auth/dto/unauthorized.dto";
import {BooksEntity} from "./entities/books.entity";
import {BookCreateDataDto, BookUpdateDataDto, BookDataDto, BookDataResponseDto} from "./dto";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {Logger} from "winston";


@Controller('book')
export class BookController {

    constructor(private readonly bookService: BookService,
                @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    @ApiTags('book')
    @UseGuards(AuthGuard)
    @ApiUnauthorizedResponse({ type: UnauthorizedDTO })
    @ApiOkResponse({ type: BooksEntity })
    @ApiBody({ type: BookCreateDataDto })
    @Post('add')
    async addBook(@Request() req: any): Promise<BookDataDto> {
        try {
            const user = await req.user;

            let bookData = new BooksEntity();
            bookData.title = req.body.title;
            bookData.genre = req.body.genre;
            bookData.author = req.body.author;
            bookData.published_at = req.body.published_at;
            bookData.thumbnail = req.body.thumbnail;
            bookData.created_at = new Date();
            bookData.updated_at = new Date();
            bookData.user_id = user.sub;

            const createdBook = await this.bookService.create(bookData);
            this.logger.info(`Book added with ID: ${createdBook.id}`);
            return createdBook;
        } catch (error: any) {
            this.logger.error('Error adding book', error.stack);
            throw new HttpException('Failed to add book', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiTags('book')
    @UseGuards(AuthGuard)
    @ApiUnauthorizedResponse({ type: UnauthorizedDTO })
    @ApiOkResponse({ type: BookDataDto })
    @Get('/list')
    async getAllBooks(@Request() req: any): Promise<BookDataResponseDto> {
        try {
            this.logger.info('Fetching books for query', req.query);
            const books = await this.bookService.getBooks(req.query);
            this.logger.info(`Fetched ${books.total} books`);
            return books;
        } catch (error: any) {
            this.logger.error('Error fetching books', error.stack);
            throw new HttpException('Failed to fetch books', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOkResponse({ type: BooksEntity })
    @Patch(':id')
    async updateBook(
        @Param('id') id: number,
        @Body() data: BookUpdateDataDto,
    ): Promise<BooksEntity> {
        try {
            this.logger.info(`Updating book with ID: ${id}`);
            const updatedBook = await this.bookService.update(id, data);
            if(!updatedBook) {
                throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
            }
            this.logger.info(`Book with ID: ${id} updated`);
            return updatedBook;
        } catch (error: any) {
            this.logger.error(`Error updating book with ID: ${id}`, error.stack);
            throw new HttpException('Failed to update book', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //get boook by id
    @ApiOkResponse({ type: BooksEntity })
    @Get(':id')
    async getBookById(@Param('id') id: number): Promise<BooksEntity> {
        try {
            this.logger.info(`Fetching book with ID: ${id}`);
            const book = await this.bookService.getBookById(id);
            if(!book) {
                throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
            }
            this.logger.info(`Fetched book with ID: ${id}`);
            return book;
        } catch (error: any) {
            this.logger.error(`Error fetching book with ID: ${id}`, error.stack);
            throw new HttpException('Failed to fetch book', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async deleteBook(@Param('id') id: number): Promise<unknown> {
        try {
            this.logger.info(`Deleting book with ID: ${id}`);
            await this.bookService.delete(id);
            this.logger.info(`Book with ID: ${id} deleted`);
            return {
                statusCode: HttpStatus.OK,
                message: 'Book deleted successfully',
            };
        } catch (error: any) {
            this.logger.error(`Error deleting book with ID: ${id}`, error.stack);
            throw new HttpException('Failed to delete book', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}