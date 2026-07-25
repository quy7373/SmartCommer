# Phase 4 - Chat Rules

## Scope

Implement realtime chat only.

---

## Database

Conversation

Message

---

## Conversation

One User

↓

One Owner

↓

One Conversation

Use

@@unique(userId, ownerId)

---

## Message

Support

TEXT

IMAGE

FILE

EMOJI

---

## APIs

GET /chat

GET /chat/:conversationId

POST /chat

DELETE /chat/:id

---

## Socket Events

chat:join

chat:leave

chat:send

chat:receive

chat:typing

chat:stopTyping

chat:seen

---

## Flow

User Send

↓

Save Database

↓

Emit Socket

↓

Receiver

---

## Seen

Receiver opens chat

↓

Update seen=true

↓

Emit chat:seen

---

## Typing

typing=true

↓

Emit

↓

Stop Typing

---

## Upload

Support

Image

File

Store URL only.

---

## Permission

User only reads own conversation.

Owner only reads own customers.

Admin read-only.

---

## Pagination

Messages

page

limit

cursor

---

## Done

✓ Send

✓ Receive

✓ Seen

✓ Typing

✓ Upload Image

✓ Upload File