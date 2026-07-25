# Phase 1 - Product Rules

## Scope

Only Product CRUD.

Use existing schema

Product

ProductImage

ProductColor

ProductVariant

---

## APIs

GET /products

GET /products/:id

POST /products

PUT /products/:id

DELETE /products/:id

---

## Permission

ADMIN

CRUD all

OWNER

CRUD own products

USER

Read only

---

## Create Product

Flow

Create Product

↓

Upload Thumbnail

↓

Upload Images

↓

Create ProductImage

↓

Create ProductColor

↓

Create ProductVariant

---

## Product Detail

Include

Store

Category

Images

Colors

Variants

---

## Product List

Support

Pagination

Search

Category Filter

Price Filter

Sort

Status

---

## Update Product

Allow

Update Product

Update Images

Update Colors

Update Variants

---

## Delete Product

Delete

Images

Colors

Variants

Inside Prisma Transaction.

---

## Validation

name

slug

description

categoryId

storeId

price

status

images

variants

---

## Repository

create()

update()

delete()

findMany()

findById()

---

## Service

Business logic only.

Controller never accesses Prisma.

---

## Upload

Use Cloudinary.

Validate image type.

Maximum file size

5MB

---

## Done

✓ CRUD Product

✓ Upload Images

✓ Product Variant

✓ Pagination

✓ Search

✓ Filter