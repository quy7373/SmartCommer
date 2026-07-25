# Smart Commerce - Phase 4 Realtime & Customer Service Rules

Version: 1.0

---

# Phase

Phase 4 - Realtime & Customer Service

Goal

Implement realtime communication between User and Owner.

Implement customer service workflows.

Only implement

✓ Chat

✓ Notification

✓ Refund

✓ Complaint

Do NOT implement

Analytics

Dashboard

Redis Cache

BullMQ

---

# Modules

Phase 4 contains

1. Chat

2. Notification

3. Refund

4. Complaint

---

# Architecture

Route

↓

Controller

↓

Service

↓

Repository

↓

Prisma

Realtime

↓

Socket.IO

Never put Socket logic inside Controller.

---

# Socket

Use Socket.IO.

Each authenticated user owns one socket session.

---

# Authentication

Socket must authenticate using JWT.

Unauthenticated socket must be disconnected.

---

# Database

Conversation

Message

Notification

Refund

Complaint

ComplaintAttachment

---

# Events

chat:send

chat:receive

chat:typing

chat:seen

notification:new

refund:created

complaint:created

---

# Validation

Every socket payload must validate with Zod.

Never trust client payload.

---

# Security

Never allow

User reading other conversations

Owner reading another owner's conversations

Always verify ownership.

---

# Definition of Done

✓ Chat

✓ Notification

✓ Refund

✓ Complaint