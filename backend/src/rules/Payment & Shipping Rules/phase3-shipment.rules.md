# Phase 3 - Shipment Rules

## Scope

Shipment Management only.

---

## Shipment Status

PREPARING

PICKED_UP

SHIPPING

DELIVERED

---

## Shipment Flow

Payment Success

↓

Create Shipment

↓

Preparing

↓

Picked Up

↓

Shipping

↓

Delivered

---

## APIs

POST /shipment

GET /shipment/:id

PUT /shipment/:id

GET /shipment/order/:orderId

---

## Database

Shipment

ShipmentHistory

---

## History

Every status update

↓

Insert ShipmentHistory

Never overwrite history.

---

## Owner Permission

Owner updates shipment.

User only views shipment.

Admin views all.

---

## Done

✓ Shipment CRUD

✓ Shipment History

✓ Status Update
