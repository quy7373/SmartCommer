# Smart Commerce Global Rules
Version: 1.0

## Project Overview

Smart Commerce is a full-stack e-commerce platform for a single store (Owner).

Roles

- ADMIN
- OWNER
- USER

Owner is both the store owner and seller.

---

## Technology Stack

Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Socket.IO
- BullMQ
- JWT Authentication
- HttpOnly Cookie

Frontend

- React
- Vite
- Tailwind CSS
- React Query
- Zustand

---

## Backend Architecture

Always follow

Route

↓

Controller

↓

Service

↓

Repository

↓

Prisma

Business logic belongs ONLY inside Service.

Controllers must never contain business logic.

Repositories only communicate with Prisma.

---

## Folder Structure

src/

auth/

controllers/

services/

repositories/

middlewares/

validators/

routes/

redis/

queues/

websocket/

integrations/

utils/

config/

logs/

---

## Authentication

Always use

- JWT
- Refresh Token
- HttpOnly Cookie

Never use

- Express Session
- LocalStorage for Tokens

---

## Validation

Always use Zod.

Every API must validate input.

---

## Database

Always use Prisma.

Never use raw SQL unless absolutely necessary.

---

## API Style

RESTful

GET

POST

PUT

PATCH

DELETE

---

## Error Response

{
    "success": false,
    "message": "",
    "errors": []
}

Success

{
    "success": true,
    "data": {}
}

---

## Naming Convention

Variables

camelCase

Functions

camelCase

Classes

PascalCase

Prisma Models

PascalCase

Database

snake_case

---

## Code Style

Use async/await.

Never use Promise.then().

Always separate

Controller

↓

Service

↓

Repository

---

## Security

Never expose

Password

JWT Secret

API Keys

Refresh Token

Always hash passwords using bcrypt.

---

## Documentation

Every public function must include comments.

Every API should have Swagger documentation.

---

## Git Commit

Use Conventional Commit

feat:

fix:

refactor:

docs:

test:

chore: