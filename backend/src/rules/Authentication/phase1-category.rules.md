# Phase 1 - Category Rules

## Scope

Only CRUD Category.

---

## APIs

GET /categories

GET /categories/:id

POST /categories

PUT /categories/:id

DELETE /categories/:id

---

## Permission

ADMIN

CRUD all

OWNER

CRUD own categories

USER

Read Only

---

## Validation

name

slug

parentId (optional)

---

## Repository

create()

update()

delete()

findMany()

findById()

---

## Service

Check Permission.

Check Duplicate Slug.

Generate Slug if missing.

---

## Pagination

Support

page

limit

search

sort

---

## Delete

Do not delete if category still contains products.

Return

409 Conflict

---

## Include

Parent

Children

Product Count

---

## Done

✓ CRUD Category

✓ Pagination

✓ Search

✓ Permission