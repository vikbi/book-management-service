# Book Management Service

This project is a Book Management API built with NestJS, TypeORM, and MySQL. It provides endpoints for managing books, users, and authentication.
moduler codebase for users and books, 
Unit tests and integration tests are added for bookmodule only
## Prerequisites

- Node.js
- MySQL

## Getting Started

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/vikbi/book-management-service.git
    cd book-management-service
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up the MySQL database and update the environment variables in the `.env` file with your database configuration.

### Running the Application

1. Start the application:
    ```bash
    npm run start
    ```

2. The application will be available at `http://localhost:3000`.

### Running Tests

1. Run the tests:
    ```bash
    npm run test
    ```

## API Endpoints

### Authentication
- `POST /user/registe`: to register a new user
- `POST /auth/login`: Login and get an access token.
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
- `GET /book/list`: Get a list of books.
- `GET /book/:id`: Get a book by ID.
- `PATCH /book/:id`: Update a book by ID.
- `DELETE /book/:id`: Delete a book by ID.

## Environment Variables

The following environment variables are used in the application:

- `NODE_ENV`: The environment in which the application is running (e.g., development, production).
- `DATABASE_HOST`: The hostname of the database.
- `DATABASE_PORT`: The port number of the database.
- `DATABASE_USER`: The username for the database.
- `DATABASE_PASSWORD`: The password for the database.
- `DATABASE_NAME`: The name of the database.
