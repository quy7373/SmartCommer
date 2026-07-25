# Phase 4 - Refund Rules

## Scope

Refund Workflow

---

## Database

Refund

Payment

Order

---

## Status

PENDING

APPROVED

REJECTED

COMPLETED

---

## APIs

POST /refund

GET /refund

GET /refund/:id

PUT /refund/:id

---

## Flow

User Request

↓

Owner Review

↓

Approve?

↓

Yes

↓

MoMo Refund

↓

Completed

No

↓

Rejected

---

## Validation

Reason

Order Exists

Payment Success

Order Delivered

---

## Permission

User

Create

View own

Owner

Approve

Reject

Admin

Override

---

## Refund Rules

One Order

↓

One Refund

Cannot refund unpaid order.

Cannot refund cancelled order.

---

## Notification

Refund Created

Refund Approved

Refund Rejected

Refund Completed

---

## Done

✓ Refund Request

✓ Refund Approval

✓ Refund Complete