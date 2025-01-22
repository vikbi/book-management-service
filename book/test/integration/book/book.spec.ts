import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksEntity } from '../../../src/book/entities/books.entity';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {AppModule} from "../../../src/app.module";

describe('BookController (e2e)', () => {
    let app: INestApplication;
    let token: string;
    let dummyUserId: number;
    let dummyBookId: number;
    const dummyUser = {
        name: 'test user',
        email: 'user@test.com',
        password: 'pass@123',
    }
    const mockBookData: any = {
        title: 'Sample Title',
        author: 'peter',
        thumbnail: 'https://test.com/test.png',
        published_at: new Date().toDateString(),
        genre: 'en',
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        user_id: 1,
    };

    const mockBooksRepository = {
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockImplementation((book) => Promise.resolve({ id: Date.now(), ...book })),
        find: jest.fn().mockResolvedValue([mockBookData]),
        findOne: jest.fn().mockResolvedValue(mockBookData),
        update: jest.fn().mockResolvedValue(null),
        delete: jest.fn().mockResolvedValue(null),
        createQueryBuilder: jest.fn().mockReturnValue({
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[mockBookData], 1]),
        }),
    };

    const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(getRepositoryToken(BooksEntity))
            .useValue(mockBooksRepository)
            .overrideProvider(WINSTON_MODULE_PROVIDER)
            .useValue(mockLogger)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        // Create a dummy user
        const userResponse = await request(app.getHttpServer())
            .post('/user/register')
            .send(dummyUser);
        dummyUserId = userResponse.body.id;

        // get auth token for the dummy user
        const authResponse = await request(app.getHttpServer())
            .post('/auth/login') // Replace with your authentication endpoint
            .send(dummyUser);

        token = authResponse.body.access_token;
    });

    afterAll(async () => {
        //delete the dummy user
        await request(app.getHttpServer())
            .delete(`/user/${dummyUserId}`)
            .set('Authorization', `Bearer ${token}`);
        await app.close();
    })

    it('/book (POST)', async () => {
        const dto = {
            title: 'Sample Title',
            author: 'peter',
            thumbnail: 'https://test.com/test.png',
            published_at: new Date(),
            genre: 'en',
        };
        return request(app.getHttpServer())
            .post('/book/add')
            .set('Authorization', `Bearer ${token}`)
            .send(dto)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
                dummyBookId = response.body.id;
                expect(response.body).toEqual({
                    id: expect.any(Number),
                    title: 'Sample Title',
                    author: 'peter',
                    thumbnail: 'https://test.com/test.png',
                    published_at: dto.published_at.toISOString(), // Ensure the date is in string format
                    genre: 'en',
                    created_at: expect.any(String), // Expect created_at to be a string
                    updated_at: expect.any(String), // Expect updated_at to be a string
                    user_id: dummyUserId, // Ensure user_id matches the expected value
                });
            });
    });

    it('/books list (GET)', async () => {
        return request(app.getHttpServer())
            .get('/book/list')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({
                    data: [{published_at: expect.any(String), created_at: expect.any(String),updated_at: expect.any(String), ...mockBookData}],
                    total: 1,
                    page: 1,
                    limit: 10,
                });
            });
    });

    it('/book/:id (GET)', async () => {
        return request(app.getHttpServer())
            .get(`/book/${dummyBookId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(mockBookData);
            });
    });

    it('/book/:id (PATCH)', async () => {
        const dto = { title: 'Updated Title' };
        return request(app.getHttpServer())
            .patch(`/book/${dummyBookId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(dto)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({
                    title: dto.title,
                    ...mockBookData
                });
            });
    });

    it('/book/:id (DELETE)', async () => {
        return request(app.getHttpServer())
            .delete(`/book/${dummyBookId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({"message": "Book deleted successfully", "statusCode": 200});
            });
    });

    //TDOO: Add more tests for edge cases > pagination, sorting, filtering, failed requests etc
});