import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookService } from '../../../src/book/book.service';
import { BooksEntity } from '../../../src/book/entities/books.entity';
import {BookUpdateDataDto} from "../../../src/book/dto";
import {Logger} from "winston";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";

describe('Unit tests : BookService ', () => {
  let service: BookService;
  let logger: Logger;

  const mockBooksRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((book) => Promise.resolve({ id: Date.now(), ...book })),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(null),
    createQueryBuilder: jest.fn().mockReturnValue({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    }),
  };

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(BooksEntity),
          useValue: mockBooksRepository,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    logger = module.get<Logger>(WINSTON_MODULE_PROVIDER);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new book record and return that data', async () => {
    const dto: Partial<BooksEntity> = {
      title: 'Sample Title',
      author: 'peter',
      thumbnail: 'https://test.com/test.png',
      published_at: new Date(),
      genre: 'en',
      created_at: new Date(),  updated_at: new Date(), user_id: 1,
    };
    expect(await service.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
  });

  it('should fetch books with pagination', async () => {
    const query = { page: 1, limit: 10, sortBy: 'title', order: 'ASC', filter: {} };
    const result = { data: [], total: 0, page: 1, limit: 10 };

    expect(await service.getBooks(query)).toEqual(result);
    expect(mockBooksRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockBooksRepository.createQueryBuilder().getManyAndCount).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith('Found 0 books');
    expect(mockLogger.info).toHaveBeenCalledWith('Fetching books with query: {"page":1,"limit":10,"sortBy":"title","order":"ASC","filter":{}}');
  });

  it('should log error if fetching records failed', async () => {
    const query = { page: 1, limit: 10, sortBy: 'title', order: 'ASC', filter: {} };

    mockBooksRepository.createQueryBuilder().getManyAndCount.mockRejectedValueOnce(new Error('Failed to fetch'));
    await expect(service.getBooks(query)).rejects.toThrow();

    expect(mockLogger.error).toHaveBeenCalledWith('Error fetching books', expect.any(String));
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });

  it('should update a book record', async () => {
    const id = 1;
    const dto: BookUpdateDataDto = {author: "test2", genre: "br", published_at: new Date(), thumbnail: "", title: 'Updated Title' };
    mockBooksRepository.update.mockResolvedValueOnce({ id, ...dto });
    mockBooksRepository.findOne.mockResolvedValueOnce({ id, ...dto });
    expect(await service.update(id, dto)).toEqual({ id, ...dto });
    expect(mockLogger.info).toHaveBeenCalledWith(`Updating book with ID: ${id}`);
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should log error if updating record failed', async () => {
    const id = 1;
    const dto: BookUpdateDataDto = {author: "test2", genre: "br", published_at: new Date(), thumbnail: "", title: 'Updated Title' };
    mockBooksRepository.findOne.mockResolvedValueOnce({ id, ...dto });
    mockBooksRepository.update.mockRejectedValueOnce(new Error('Failed to update'));
    await expect(service.update(id, dto)).rejects.toThrow();

    expect(mockLogger.info).toHaveBeenCalledWith(`Updating book with ID: ${id}`);
    expect(mockLogger.error).toHaveBeenCalledWith(`Error updating book with ID: ${id}`, expect.any(String));
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  })

it('should log error if book not found', async () => {
  const id = 1;
  const dto: BookUpdateDataDto = {author: "test2", genre: "br", published_at: new Date(), thumbnail: "", title: 'Updated Title' };

  mockBooksRepository.update.mockReturnValue({ affected: 0 });

  try{
    await service.update(id, dto);
  } catch (e:any) {
    expect(e.message).toBe('Failed to update book');
  }
  expect(mockLogger.info).toHaveBeenCalledWith(`Updating book with ID: ${id}`);
  expect(mockLogger.error).toHaveBeenCalledTimes(2);
  expect(mockLogger.error).toHaveBeenCalledWith(`Book with ID: ${id} not found : BookService.update`);
});

  it('should delete a book record', async () => {
    const id = 1;
    expect(await service.delete(id)).toEqual({ deleted: true });
    expect(mockBooksRepository.delete).toHaveBeenCalledWith({"id": id});
    expect(mockLogger.info).toHaveBeenCalledWith(`Deleted book with ID: ${id}`);
  });

  it('should log error if deleting record failed', async () => {
    const id = 1;
    mockBooksRepository.delete.mockRejectedValueOnce(new Error('Failed to delete'));
    await expect(service.delete(id)).rejects.toThrow();

    expect(mockLogger.error).toHaveBeenCalledWith(`Error deleting book with ID: ${id}`, expect.any(String));
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  })
});