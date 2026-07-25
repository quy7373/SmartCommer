# Phase 4 - Complaint Rules

## Scope

Complaint Management

---

## Database

Complaint

ComplaintAttachment

---

## Status

PENDING

OWNER_RESPONDED

ESCALATED

RESOLVED

CLOSED

---

## APIs

POST /complaints

GET /complaints

GET /complaints/:id

PUT /complaints/:id

---

## Flow

User

↓

Create Complaint

↓

Owner Reply

↓

Satisfied?

↓

Yes

↓

Closed

No

↓

Escalated

↓

Admin Review

↓

Resolved

↓

Closed

---

## Attachments

Support

Image

Video

Invoice

Store file URL only.

---

## Permission

User

Own Complaint

Owner

Own Store

Admin

All

---

## Notification

Complaint Created

Owner Responded

Escalated

Resolved

Closed

---

## Validation

Order Exists

User Purchased

Complaint Not Closed

---

## Done

✓ Complaint

✓ Attachment

✓ Escalation

✓ Admin Resolution