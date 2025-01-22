import {HttpException, HttpStatus, Inject, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BooksEntity} from "./entities/books.entity";
import {BookDataResponseDto, BookUpdateDataDto, getBooksDto} from "./dto";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {Logger} from "winston";

@Injectable()
export class BookService {

    constructor(
        @InjectRepository(BooksEntity)
        private bookRepository: Repository<BooksEntity>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    /**
     * Fetch books
     * @param query
     */
    async getBooks(query: getBooksDto): Promise<BookDataResponseDto> {
       try {
           this.logger.info(`Fetching books with query: ${JSON.stringify(query)}` );
           const {page = 1, limit = 10, sortBy = 'title', order = 'ASC', filter} = query;

           const queryBuilder = this.bookRepository.createQueryBuilder('books');

           // Apply filtering
           if (filter) {
               Object.keys(filter).forEach((key: string) => {
                   queryBuilder.andWhere(`books.${key} LIKE :${key}`, {
                       [key]: `%${filter[key]}%`,
                   });
               });
           }

           // Apply sorting
           queryBuilder.orderBy(`books.${sortBy}`, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');

           // Apply pagination
           queryBuilder.skip((page - 1) * limit).take(limit);

           const [data, total] = await queryBuilder.getManyAndCount();

           this.logger.info(`Found ${total} books`);

           return {
               data,
               total,
               page,
               limit,
           };
       } catch (e: any) {
           this.logger.error('Error fetching books', e.stack);
           throw new HttpException('Failed to fetch books', HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }

    async getBookById(id: number): Promise<BooksEntity | null> {
        try {
            this.logger.info(`Fetching book with ID: ${id}`);
            const book = await this.bookRepository.findOne({ where: { id } });
            if (!book) {
                this.logger.error(`Book with ID: ${id} not found : BookService.getBookById`);
                throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
            }
            return book;
        } catch (error: any) {
            this.logger.error(`Error fetching book with ID: ${id}`, error.stack);
            throw new HttpException('Failed to fetch book', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async create(data: Partial<BooksEntity>): Promise<BooksEntity> {
        try {
            this.logger.info(`Creating a new book with data: ${JSON.stringify(data)}`);
            this.bookRepository.create(data);
            const book = await this.bookRepository.save(data);
            this.logger.info(`Created book with ID: ${book.id}`);
            return book;
        } catch (error: any) {
            this.logger.error('Error creating book', error.stack);
            throw new HttpException('Failed to create book', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: number, data: BookUpdateDataDto): Promise<BooksEntity | null> {
        try {
            this.logger.info(`Updating book with ID: ${id}`);
            const updateResult = await this.bookRepository.update({ id }, data);
            if (updateResult?.affected === 0) {
                this.logger.error(`Book with ID: ${id} not found : BookService.update`);
                throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
            }
            const book = await this.bookRepository.findOne({ where: { id } });
            return book;
        } catch (error: any) {
            this.logger.error(`Error updating book with ID: ${id}`, error.stack);
            throw new HttpException('Failed to update book', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: number): Promise<unknown> {
        try {
            await this.bookRepository.delete({ id });
            this.logger.info(`Deleted book with ID: ${id}`);
            return { deleted: true };
        } catch (error: any) {
            this.logger.error(`Error deleting book with ID: ${id}`, error.stack);
            throw new HttpException('Failed to delete book', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}