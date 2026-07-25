# Phase 1 - Profile Rules

## Scope

Only implement

- Get Profile
- Update Profile
- Change Password

---

## APIs

GET /api/profile

PUT /api/profile

PUT /api/profile/password

---

## Get Profile

Return

- id
- name
- email
- avatar
- role

Never return password.

---

## Update Profile

Allow

- name
- phone
- avatar
- address

Do NOT allow

- role
- email
- provider

---

## Change Password

Validate

- oldPassword
- newPassword
- confirmPassword

Flow

Compare Password

↓

Hash Password

↓

Update User

---

## Validation

Use Zod.

Every endpoint must validate request.

---

## Repository

Functions

findById()

update()

changePassword()

---

## Service

Business Logic only.

No req/res.

---

## Security

Password always hashed.

Never expose password.

---

## Done

✓ Get Profile

✓ Update Profile

✓ Change Password