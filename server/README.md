# VolunteerHub Backend

This backend is scaffolded to support the current volunteer frontend:

- profile editing and skill saving
- event listing and event details
- application view and withdraw flows
- Clerk-authenticated user data

## Setup

1. Copy `.env.example` to `.env`
2. Create a PostgreSQL database
3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run the first migration:

```bash
npm run prisma:migrate
```

6. Start the server:

```bash
npm run dev
```

## Planned API surface

- `GET /api/health`
- `GET /api/me/profile`
- `PUT /api/me/profile`
- `GET /api/events`
- `GET /api/events/:eventId`
- `POST /api/events/:eventId/applications`
- `GET /api/me/applications`
- `GET /api/me/applications/:applicationId`
- `DELETE /api/me/applications/:applicationId`
