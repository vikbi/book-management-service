# Book Management Service

This project is a Book Management API built with NestJS, TypeORM, and MySQL. It provides endpoints for managing books, users, and authentication.
moduler codebase for users and books, 
Unit tests and integration tests are added for bookmodule only
## Prerequisites

- Node.js v18 or above
- MySQL

  for mysql configuration you can use xampp panel, https://www.apachefriends.org/download.html
## Getting Started

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/vikbi/book-management-service.git
    cd book-management-service/book
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up the MySQL database and update the environment variables in the `.env` file with your database configuration, example env file given.

### Running the Application

1. Start the application:
    ```bash
    npm run start
    ```

2. The application will be available at `http://localhost:3000`. you can change application port in env file if you wish to

### Running Tests

1. Run the tests:
    ```bash
    npm run test
    ```
tests will cover book module, unit tests for service added and integration tests for book module only
## API Endpoints

### Authentication
- `POST /user/registe`: to register a new user
payload > {
name: 'test',
email: 'test@test.com',
password: 'test@123'
}
- 
- `POST /auth/login`: Login and get an access token.
payload > {
email: 'test@test.com',
password: 'test@123'
}
- 
- `GET /auth/me`: Get the authenticated user's details.

### Users

- `GET /user`: Get a list of users.
- `POST /user/register`: Register a new user.
- `GET /user/:id`: Get a user by ID.
- `PUT /user/:id`: Update a user by ID.
- `DELETE /user/:id`: Delete a user by ID.

### Books
Note: access_token received from login api response need to be sent in authorization headers, Bearer <token>
- `POST /book/add`: Add a new book.
{
    "title": "tested book",
    "author": "peter",
    "genre": "br",
    "published_at":  "2025-01-20T17:10:57.779Z",
    "thumbnail": "http://test.com/test.png"
}
- 
- `GET /book/list`: Get a list of books.
example : localhost:3000/book/list?page=2&limit=1&sortBy=genre

- 
- `GET /book/:id`: Get a book by ID.
- `PATCH /book/:id`: Update a book by ID.
- `DELETE /book/:id`: Delete a book by ID.

## Environment Variables

The following environment variables are used in the application:

- `DB_HOST`: The hostname of the database.
- `DB_PORT`: The port number of the database.
- `DB_USERNAME`: The username for the database.
- `DB_PASSWORD`: The password for the database.
- `DB_NAME`: The name of the database.
