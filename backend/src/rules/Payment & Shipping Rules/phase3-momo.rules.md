# Phase 3 - MoMo Payment Rules

## Scope

Implement only

- Payment Setting

- Create Payment

- QR Code

- Callback

- Verify Signature

---

## Database

Payment

PaymentSetting

Order

---

## Payment Setting

Owner enters

PartnerCode

AccessKey

SecretKey

Environment

Backend

↓

Encrypt

↓

Save Database

Never save plaintext secret key.

---

## Payment Status

PENDING

SUCCESS

FAILED

REFUNDED

---

## Create Payment

Endpoint

POST /payment/momo

Flow

Receive Order

↓

Validate

↓

Generate Request

↓

Call MoMo API

↓

Receive QR

↓

Save Payment

↓

Return QR

---

## Callback

Endpoint

POST /payment/momo/callback

Flow

Verify Signature

↓

Verify Amount

↓

Verify Order

↓

Update Payment

↓

Update Order

↓

Create Shipment

↓

Notification

Never trust callback without signature verification.

---

## Repository

PaymentRepository

PaymentSettingRepository

OrderRepository

---

## Service

Generate Signature

Verify Signature

Generate QR

Update Payment

Update Order

---

## Security

Always encrypt

PartnerCode

AccessKey

SecretKey

Never expose keys.

---

## Done

✓ Payment Setting

✓ QR

✓ Callback

✓ Signature
