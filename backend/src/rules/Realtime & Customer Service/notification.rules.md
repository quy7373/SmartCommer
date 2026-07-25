# Phase 4 - Notification Rules

## Scope

Realtime Notification

---

## Database

Notification

---

## Notification Types

ORDER

PAYMENT

REFUND

COMPLAINT

CHAT

SYSTEM

---

## APIs

GET /notifications

PUT /notifications/read

PUT /notifications/read-all

DELETE /notifications/:id

---

## Socket Event

notification:new

notification:read

notification:delete

---

## Flow

Create Notification

↓

Save Database

↓

Emit Socket

↓

Frontend

---

## Auto Notifications

New Chat

Refund Request

Complaint

Order Delivered

Order Cancelled

Payment Success

---

## Done

✓ Realtime Notification

✓ Read

✓ Read All

✓ Delete