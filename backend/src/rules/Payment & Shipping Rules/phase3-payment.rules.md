# Smart Commerce - Phase 3 Payment & Shipping Rules

Version: 1.0

---

# Phase

Phase 3 - Payment & Shipping

Goal

Implement secure payment processing and shipment management.

Only implement features listed in this document.

Do NOT implement

- Chat
- Complaint
- Refund
- Analytics
- Dashboard

---

# Features

Implement

✓ Payment Setting

✓ MoMo Payment

✓ Payment Callback

✓ Order Payment

✓ Shipment

✓ Shipment History

✓ Google Maps Tracking

✓ Notification

---

# Modules

This phase is divided into

1. Payment Setting

2. Payment Gateway

3. Shipment

4. Tracking

5. Notification

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

# Security

Never trust frontend payment result.

Always verify payment callback.

Never expose secret keys.

Encrypt payment credentials before storing.

---

# Payment Providers

Current

✓ MoMo

Future

VNPay

Stripe

PayPal

Always design code to support multiple providers.

Use Strategy Pattern.

---

# Payment Flow

Checkout

↓

Create Pending Payment

↓

Generate QR

↓

Customer Pays

↓

MoMo Callback

↓

Verify Signature

↓

Update Payment

↓

Update Order

↓

Create Shipment

↓

Send Notification

---

# Shipment Flow

Order Paid

↓

Preparing

↓

Picked Up

↓

Shipping

↓

Delivered

---

# Tracking Flow

Driver Update

↓

Shipment History

↓

Socket Notification

↓

Frontend Google Maps

---

# Notification

Events

NEW_ORDER

PAYMENT_SUCCESS

PAYMENT_FAILED

ORDER_SHIPPING

ORDER_DELIVERED

---

# Validation

Use Zod.

Every endpoint must validate request.

---

# Transaction

Always use Prisma Transaction for

Payment Update

Order Update

Shipment Creation

---

# Definition of Done

✓ Payment

✓ Shipment

✓ Tracking

✓ Notification
