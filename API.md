# API Documentation

## Base URL
`/api`

## Authentication
Most endpoints require authentication via Supabase Auth. Include the user's session token in requests.

---

## Events

### GET `/api/events`
Get all events with optional filters.

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search by title
- `organizerId` (optional): Filter by organizer

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Event Title",
    "description": "Event description",
    "date": "2024-12-15",
    "time": "09:00 AM",
    "location": "Venue",
    "price": 49,
    "category": "Tech",
    "organizers": {
      "org_name": "Organizer Name",
      "logo_url": "https://..."
    }
  }
]
```

### POST `/api/events`
Create a new event.

**Body:**
```json
{
  "title": "Event Title",
  "description": "Description",
  "date": "2024-12-15",
  "time": "09:00",
  "location": "Venue",
  "price": 49,
  "category": "Tech",
  "organizer_id": "uuid"
}
```

### GET `/api/events/[id]`
Get a single event by ID.

### PUT `/api/events/[id]`
Update an event.

### DELETE `/api/events/[id]`
Delete an event.

---

## Communities

### GET `/api/communities`
Get all communities with optional filters.

**Query Parameters:**
- `category` (optional)
- `search` (optional)
- `organizerId` (optional)

### POST `/api/communities`
Create a new community.

**Body:**
```json
{
  "name": "Community Name",
  "description": "Description",
  "category": "Lifestyle",
  "location": "Metro Area",
  "organizer_id": "uuid"
}
```

---

## Organizers

### GET `/api/organizers`
Get all organizers.

### POST `/api/organizers`
Create organizer profile.

**Body:**
```json
{
  "id": "user_uuid",
  "org_name": "Organization Name",
  "bio": "Bio text",
  "phone": "+1234567890"
}
```

---

## Search

### GET `/api/search`
Search across events and communities.

**Query Parameters:**
- `q` (required): Search query
- `type` (optional): 'all', 'events', or 'communities'

**Response:**
```json
{
  "events": [...],
  "communities": [...]
}
```

---

## Payments

### POST `/api/payments`
Create a payment order.

**Body:**
```json
{
  "amount": 49,
  "currency": "INR",
  "type": "ticket_purchase",
  "organizerId": "uuid",
  "eventId": "uuid"
}
```

**Response:**
```json
{
  "orderId": "razorpay_order_id",
  "amount": 4900,
  "currency": "INR",
  "paymentId": "internal_payment_id"
}
```

---

## Webhooks

### POST `/api/webhooks/razorpay`
Razorpay payment webhook endpoint.

**Headers:**
- `x-razorpay-signature`: Webhook signature

**Body:**
Razorpay webhook payload

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error
