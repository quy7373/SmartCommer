# Phase 1 - Authentication Rules

## Scope

Only implement

- Register
- Login
- Google OAuth
- GitHub OAuth
- Refresh Token
- Logout
- JWT Authentication

Do NOT implement

- Order
- Cart
- Payment
- Chat
- Notification

---

## Authentication

Use

- JWT
- Refresh Token
- HttpOnly Cookie
- bcrypt

Never use

- Session Authentication
- LocalStorage for Token

---

## JWT

Access Token

- 15 minutes

Refresh Token

- 30 days

Store Refresh Token in HttpOnly Cookie.

---

## Register

Endpoint

POST /api/auth/register

Validate

- email
- password
- confirmPassword
- name

Flow

Validate

↓

Email Exists?

↓

Hash Password

↓

Create User

↓

Return User

---

## Login

POST /api/auth/login

Flow

Find User

↓

Compare Password

↓

Generate JWT

↓

Set Cookie

↓

Return User

---

## Google OAuth

Flow

Google Login

↓

Find User

↓

Create User if not exists

↓

Generate JWT

↓

Cookie

---

## GitHub OAuth

Same flow as Google OAuth.

---

## Logout

POST /api/auth/logout

Flow

Clear Cookie

↓

Delete Refresh Token

↓

Return Success

---

## Refresh Token

POST /api/auth/refresh

Flow

Verify Refresh Token

↓

Generate Access Token

↓

Set Cookie

---

## Middleware

Required

authenticate()

authorize()

validate()

errorHandler()

---

## Security

Always hash password.

Always verify JWT.

Never expose password.

Never expose refresh token.

---

## Done

✓ Register

✓ Login

✓ Google

✓ GitHub

✓ Logout

✓ Refresh Token

✓ JWT Middleware