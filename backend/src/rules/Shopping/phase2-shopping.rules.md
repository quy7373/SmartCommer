# Smart Commerce - Phase 2 Shopping Rules
Version: 1.0

---

# Phase

Phase 2 - Shopping

Goal

Build the complete shopping workflow.

Only implement features listed in this document.

Do NOT implement

- Payment Gateway
- Shipping Tracking
- Chat
- Notification
- Refund
- Complaint
- Analytics

---

# Features

Implement only

- Cart
- Cart Item
- Wishlist
- Coupon
- Checkout
- Order
- Order Item
- Product Review

---

# Permission

ADMIN

Can

- View all Orders
- Update Order Status
- Delete Orders
- View Reviews

Cannot

- Checkout

---

OWNER

Can

- View Orders of own Store
- Update Order Status
- View Reviews

Cannot

- Checkout

---

USER

Can

- Add Cart
- Update Cart
- Remove Cart
- Wishlist
- Checkout
- Review Product
- View Own Orders

---

# Backend Architecture

Route

↓

Controller

↓

Service

↓

Repository

↓

Prisma

Never skip layers.

---

# Cart Module

Implement

- Get Cart
- Add Product
- Update Quantity
- Remove Item
- Clear Cart

Endpoints

GET /cart

POST /cart

PUT /cart/:id

DELETE /cart/:id

DELETE /cart

---

# Cart Rules

Each User has only ONE Cart.

CartItem references ProductVariant.

Always check

- Product exists
- Variant exists
- Stock available

Reject when stock is insufficient.

---

# Cart Quantity

Minimum

1

Maximum

Current Stock

Never allow quantity <= 0.

---

# Wishlist Module

Implement

GET /wishlist

POST /wishlist

DELETE /wishlist/:productId

---

# Wishlist Rules

User cannot wishlist the same product twice.

Use

@@unique(userId, productId)

---

# Coupon Module

Implement

GET /coupons

POST /coupon/apply

---

# Coupon Validation

Check

Coupon exists

Coupon active

Start date

Expire date

Quantity

Minimum Order

Maximum Discount

Used Count

---

# Checkout Module

Endpoint

POST /checkout

Flow

Validate Cart

↓

Check Product Stock

↓

Calculate Total

↓

Apply Coupon

↓

Calculate Discount

↓

Create Order

↓

Create Order Items

↓

Decrease Inventory

↓

Clear Cart

↓

Return Order

---

# Checkout Rules

Everything must execute inside Prisma Transaction.

Never create Order without Order Items.

Never reduce stock outside transaction.

---

# Order Module

Implement

GET /orders

GET /orders/:id

PUT /orders/:id/status

---

# User Order

User only sees own orders.

---

# Owner Order

Owner only sees orders containing own products.

---

# Admin Order

Admin sees every order.

---

# Order Status

Allowed

PENDING

CONFIRMED

PROCESSING

SHIPPING

DELIVERED

CANCELLED

REFUNDED

---

# Order Flow

PENDING

↓

CONFIRMED

↓

PROCESSING

↓

SHIPPING

↓

DELIVERED

Cancellation

PENDING

↓

CANCELLED

Refund handled in Phase 4.

---

# Inventory Rules

Reduce stock after successful Order creation.

Never allow stock below zero.

Inventory update must use transaction.

---

# Product Review

Implement

POST /reviews

GET /products/:id/reviews

PUT /reviews/:id

DELETE /reviews/:id

---

# Review Rules

Only users who purchased AND received the product can review.

One review per product per user.

Use

@@unique(userId, productId)

---

# Product Rating

Whenever Review changes

Recalculate Product.rating

Average

Total Reviews

Always update Product.

---

# Pagination

All list APIs support

page

limit

search

sort

---

# Response Format

Success

{
    "success": true,
    "data": {}
}

Error

{
    "success": false,
    "message": "",
    "errors": []
}

---

# Validation

Use Zod

cart.schema.ts

checkout.schema.ts

review.schema.ts

coupon.schema.ts

---

# Repository Rules

Repositories only access Prisma.

No business logic.

---

# Service Rules

Business logic belongs only inside Service.

Examples

Calculate Discount

Check Inventory

Create Order

Apply Coupon

Update Rating

---

# Transaction Rules

Always use Prisma Transaction for

Checkout

Order Creation

Stock Update

Coupon Update

---

# Security

Always verify authenticated User.

Never trust product price from frontend.

Always calculate price from database.

Never trust discount from frontend.

---

# Performance

Use include/select wisely.

Never query inside loops.

Batch database operations whenever possible.

---

# Logging

Log

Order Error

Checkout Error

Coupon Error

Inventory Error

Never log

Sensitive User Data

---

# Definition of Done

Cart

✓ CRUD

Wishlist

✓ CRUD

Coupon

✓ Apply Coupon

Checkout

✓ Create Order

✓ Order Item

✓ Inventory Update

Order

✓ User Orders

✓ Owner Orders

✓ Admin Orders

Review

✓ CRUD

✓ Product Rating Update

Validation

✓ Zod

Transaction

✓ Prisma Transaction

Security

✓ Stock Validation

✓ Server-side Price Validation

Performance

✓ Pagination

✓ Search

✓ Sorting