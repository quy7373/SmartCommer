# Phase 5 - BullMQ Rules

## Scope

Background Jobs only.

---

## Queues

Email Queue

Notification Queue

Refund Queue

Analytics Queue

Invoice Queue

Shipping Queue

Cache Queue

---

## Workers

Email Worker

Notification Worker

Refund Worker

Analytics Worker

Shipping Worker

---

## Job Flow

Create Job

↓

Queue

↓

Worker

↓

Database

↓

Notification

---

## Retry

Default

3 retries

Backoff

Exponential

---

## Failed Job

Log Error

Retry

Notify Admin

---

## Done

✓ Queue

✓ Worker

✓ Retry

✓ Monitoring