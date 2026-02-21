# Esports Tournament Booking Platform Backend

Production-ready backend for a generic Esports Tournament Booking Platform built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- User auth (signup/login)
- Role-based access (`USER`, `ADMIN`)
- Tournament lifecycle management (`DRAFT`, `PUBLISHED`, `LIVE`, `COMPLETED`, `CANCELLED`)
- Public published tournaments listing
- Slot booking flow with manual team-member entry
- Payment initiation + payment confirmation
- Transaction-safe registration confirmation and slot increment
- Duplicate registration prevention
- Overbooking prevention with MongoDB transaction
- Booking deadline enforcement
- Banned-user booking prevention
- Room access only for registered users when tournament is `LIVE`
- Admin tournament entries/slots/user moderation APIs
- Swagger API docs and OpenAPI file in `docs/`

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Joi validation
- Centralized error handling
- Swagger UI (`swagger-ui-express`) + OpenAPI YAML

## Project Structure

```txt
backend/
├── docs/
│   ├── openapi.yaml
│   └── postman_collection.json
├── scripts/
│   ├── initDatabase.js
│   └── testConnection.js
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    ├── constants/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    └── validators/
```

## Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Create `.env` from `.env.example`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/apex-arena
JWT_SECRET=replace-with-very-strong-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

3. Run dev server

```bash
npm run dev
```

4. Optional seed

```bash
npm run init-db
```

## API Documentation

- Swagger UI: `http://localhost:5000/api/docs`
- Raw OpenAPI YAML: `http://localhost:5000/api/docs/raw/openapi.yaml`
- Postman collection: `docs/postman_collection.json`

## Auth

Use bearer token for protected routes:

```http
Authorization: Bearer <jwt>
```

## Core Business Flow

### User Booking Flow

1. Signup/Login
2. Fetch published tournaments
3. Book slot (`/api/registrations/book-slot`) with:
   - `selectedTeamSize`
   - `players[]` manual details
4. Confirm payment (`/api/registrations/confirm-payment`)
5. On success, backend transaction does:
   - duplicate checks
   - slot-availability check
   - deadline check
   - increments `filledSlots`
   - locks team
   - creates registration
6. User can view booked tournaments (`/api/registrations/my`)
7. User can read room credentials only when `LIVE` and registered

## Main API Endpoints

### Auth
- `POST /api/auth/register` - Signup
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Tournaments
- `GET /api/tournaments/published/list` - Public published tournaments
- `GET /api/tournaments` - List tournaments (filter by status/mode)
- `GET /api/tournaments/:id` - Tournament details
- `GET /api/tournaments/:id/room-access` - Room details (registered + LIVE only)

### Booking / Registrations
- `POST /api/registrations/book-slot` - Initiate booking/payment
- `POST /api/registrations/confirm-payment` - Confirm payment and register (transaction)
- `GET /api/registrations/my` - User registered tournaments

### Admin - Tournaments
- `POST /api/tournaments` - Create tournament
- `PATCH /api/tournaments/:id` - Edit tournament
- `DELETE /api/tournaments/:id` - Delete tournament
- `PATCH /api/tournaments/:id/status` - Change status
- `PATCH /api/tournaments/:id/room` - Set room ID/password
- `GET /api/tournaments/:id/entries` - Tournament entries

### Admin - Registrations / Users
- `GET /api/registrations` - All registrations
- `GET /api/users` - List users
- `PATCH /api/users/:id/ban` - Ban/unban user

## Tournament Payload Example (Admin)

`POST /api/tournaments`

```json
{
  "title": "Weekend BGMI Cup",
  "gameName": "BGMI",
  "mode": "CUSTOM",
  "teamSize": 3,
  "entryFee": 100,
  "prizePool": 50000,
  "totalSlots": 64,
  "startDateTime": "2026-03-01T10:00:00.000Z",
  "registrationDeadline": "2026-02-28T18:00:00.000Z",
  "status": "DRAFT"
}
```

## Book Slot Example (User)

`POST /api/registrations/book-slot`

```json
{
  "tournamentId": "65f1a2b3c4d5e6f708091011",
  "selectedTeamSize": 2,
  "players": [
    { "name": "Leader", "bgmiId": "LEADER_BGMI" },
    { "name": "Teammate", "bgmiId": "TEAM_BGMI" }
  ]
}
```

## Confirm Payment Example (User)

`POST /api/registrations/confirm-payment`

```json
{
  "paymentId": "65f1a2b3c4d5e6f708091099",
  "paymentStatus": "SUCCESS",
  "providerTransactionId": "TXN-12345"
}
```

## Security & Validation Notes

- Admin routes are guarded by role middleware
- Banned users are blocked from booking
- Registration deadline and full-slot checks are enforced
- Duplicate booking/registration is blocked
- Transaction prevents race-condition overbooking

## Scripts

- `npm run dev` - start dev server
- `npm start` - start production server
- `npm run init-db` - seed sample data
- `npm run test-db` - test database connectivity

## Teammate Handoff Notes

- For endpoint contracts and request/response details, use Swagger (`/api/docs`)
- For API client import, use `docs/postman_collection.json`
- For schema-level details, check models under `src/models`
- For business rules, check services under `src/services`
