# Phase 3 - Notification Rules

## Scope

Realtime Notification only.

---

## Events

NEW_ORDER

PAYMENT_SUCCESS

PAYMENT_FAILED

ORDER_PREPARING

ORDER_SHIPPING

ORDER_DELIVERED

---

## Database

Notification

---

## APIs

GET /notifications

PUT /notifications/read

DELETE /notifications/:id

---

## Socket

Every Notification

↓

Save Database

↓

Emit Socket

↓

Frontend

---

## User Notification

Order

Shipping

Payment

---

## Owner Notification

New Order

Payment Success

Shipment Update

---

## Admin Notification

System Error

Payment Error

---

## Done

✓ Socket Notification

✓ Database Notification

✓ Read Notification
