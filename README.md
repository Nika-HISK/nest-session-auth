# NestJS Session Authentication

A robust NestJS application implementing session-based authentication with PostgreSQL database integration. This project provides user registration, login/logout functionality, and a complete CRUD system for user notes with proper authorization controls.

## Features

- **Session-based Authentication**: Secure authentication using express-session with PostgreSQL session store
- **User Management**: Complete user registration and authentication system
- **Notes CRUD**: Full Create, Read, Update, Delete operations for user notes
- **Database Integration**: TypeORM with PostgreSQL for data persistence
- **Security**: Password hashing with bcrypt, session management, and route protection
- **Authorization**: User-specific data access with proper authorization guards

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport.js with local strategy
- **Session Management**: express-session with connect-pg-simple
- **Password Security**: bcrypt
- **Language**: TypeScript
- **Testing**: Jest

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                 # Data transfer objects
│   ├── auth.controller.ts   # Authentication endpoints
│   ├── auth.service.ts      # Authentication business logic
│   ├── auth.module.ts       # Authentication module configuration
│   ├── local.strategy.ts    # Passport local strategy
│   ├── session.serializer.ts # Session serialization
│   ├── local-auth.guard.ts  # Local authentication guard
│   └── authenticated.guard.ts # Route protection guard
├── user/                    # User module
│   ├── dto/                 # User DTOs
│   ├── entities/            # User entity
│   ├── user.controller.ts   # User endpoints
│   ├── user.service.ts      # User business logic
│   └── user.module.ts       # User module configuration
├── note/                    # Notes module
│   ├── dto/                 # Note DTOs
│   ├── entities/            # Note entity
│   ├── note.controller.ts   # Notes CRUD endpoints
│   ├── note.service.ts      # Notes business logic
│   └── note.module.ts       # Notes module configuration
├── common/                  # Shared utilities
│   └── baseEntity.ts        # Base entity with timestamps
├── app.controller.ts        # Main application controller
├── app.service.ts           # Main application service
├── app.module.ts            # Root application module
└── main.ts                  # Application bootstrap
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Nika-HISK/nest-session-auth
cd nest-session-auth
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Session Configuration
SESSION_SECRET=your_secure_session_secret

# Application Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Database Setup**

Ensure PostgreSQL is running and create the database specified in your `.env` file. The application will automatically create tables using TypeORM synchronization.

5. **Start the application**

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Logout
```http
POST /auth/logout
```

### Notes (Authenticated Routes)

All note endpoints require authentication via session cookies.

#### Create Note
```http
POST /notes
Content-Type: application/json

{
  "title": "My Note Title",
  "content": "Note content here..."
}
```

#### Get All User Notes
```http
GET /notes
```

#### Get Specific Note
```http
GET /notes/:id
```

#### Update Note
```http
PUT /notes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Note
```http
DELETE /notes/:id
```

## Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `firstName`: String
- `lastName`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `deletedAt`: Timestamp (Soft Delete)

### Notes Table
- `id`: UUID (Primary Key)
- `title`: String
- `content`: Text
- `userId`: UUID (Foreign Key)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `deletedAt`: Timestamp (Soft Delete)

### Session Table
- Automatically created by connect-pg-simple
- Stores session data in PostgreSQL

## Security Features

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 10
- Plain text passwords are never stored in the database

### Session Management
- Sessions are stored in PostgreSQL using connect-pg-simple
- Session cookies are HTTP-only for XSS protection
- Configurable session expiration (default: 24 hours)
- Secure cookie settings in production

### Authorization
- Route-level protection using `AuthenticatedGuard`
- User-specific data access (users can only access their own notes)
- Proper error handling for unauthorized access attempts

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run start:dev

# Build the application
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Lint and fix code
npm run lint

# Format code
npm run format
```

### Code Quality

The project includes:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## Configuration

### CORS
CORS is configured to allow requests from the frontend URL specified in environment variables with credentials enabled.

### TypeORM
Database synchronization is enabled in development mode. For production, consider using migrations instead.

### Session Configuration
- Session data is stored in PostgreSQL
- Session cookies expire after 24 hours by default
- Sessions are not saved if uninitialized
- Sessions are not resaved if unchanged

## Error Handling

The application includes comprehensive error handling:
- Validation errors for invalid input data
- Authentication errors for invalid credentials
- Authorization errors for accessing forbidden resources
- Database errors with appropriate HTTP status codes
