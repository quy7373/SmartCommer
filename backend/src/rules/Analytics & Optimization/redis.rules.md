# Phase 5 - Redis Rules

## Scope

Redis only.

---

## Use Redis For

OTP

Refresh Token

Product Cache

Category Cache

Search Cache

Dashboard Cache

Visitor Counter

Rate Limit

Online Users

Socket Session

---

## Cache Keys

product:{id}

category:{id}

search:{keyword}

dashboard:owner:{id}

dashboard:admin

visitor:today

---

## TTL

Product

30 minutes

Search

10 minutes

Dashboard

5 minutes

OTP

5 minutes

Refresh Token

30 days

---

## Cache Strategy

Read

↓

Redis

↓

Miss

↓

Database

↓

Redis

↓

Return

---

## Never Cache

Password

JWT

Payment Secret

OAuth Secret

---

## Done

✓ Cache

✓ TTL

✓ Invalidation