# VolunteerHub

VolunteerHub is a full-stack volunteer management system built as a minor project. It helps volunteers sign in securely, manage their profile, browse event drives, apply to events, track their applications, and withdraw applications when needed.

The project is designed to demonstrate a real-world web application workflow using a modern frontend, backend API, authentication system, relational database, and cloud deployment.

## Overview

VolunteerHub solves a simple but practical problem: volunteer coordination is often handled through messages, forms, and spreadsheets, which makes event participation difficult to manage. This project centralizes the process in one platform where users can:

- sign in securely
- update their volunteer profile
- add and remove skills
- browse event details
- apply for an event
- view submitted applications
- withdraw an application

## Live Deployment

- Frontend: [https://volunteerhub-tau.vercel.app/profile](https://volunteerhub-tau.vercel.app/profile)
- Backend: [https://volunteerhub-sjch.onrender.com/](https://volunteerhub-sjch.onrender.com/)
- Health Check: [https://volunteerhub-sjch.onrender.com/api/health](https://volunteerhub-sjch.onrender.com/api/health)

## Author

- Name: Charitha nl
- Email: nlcharitha@gmail.com

## Features

- Clerk-based user authentication
- Volunteer profile management
- Skill add/remove flow
- Event details page with live backend data
- Event application submission
- Application details page
- Withdraw application flow
- PostgreSQL-backed persistent storage
- Full-stack deployment support

## Demo Highlights

The deployed application currently demonstrates these working screens and flows:

- dashboard overview
  <img width="941" height="494" alt="image" src="https://github.com/user-attachments/assets/781e018f-c5ce-4da5-b732-4fb2ca9322f5" />

- event details page
  <img width="947" height="494" alt="image" src="https://github.com/user-attachments/assets/1daff920-1199-4a6b-bcb0-ed183f3062ee" />

- event application flow
  <img width="954" height="476" alt="image" src="https://github.com/user-attachments/assets/f83f50f6-6055-46cf-bfe2-824eb518de80" />

- applications list with view and withdraw
  <img width="954" height="498" alt="image" src="https://github.com/user-attachments/assets/3680d5b7-ca0d-4a0c-a726-2112ec9e9354" />

<img width="941" height="502" alt="image" src="https://github.com/user-attachments/assets/53ad6437-958d-496e-b41b-73badeccd577" />


## Tech Stack

### Frontend
- React
- Vite
- React Router
- CSS
- Clerk React SDK

### Backend
- Node.js
- Express
- Prisma ORM
- Clerk Express SDK

### Database
- PostgreSQL
- Neon

### Deployment
- Vercel for frontend
- Render for backend

### Testing
- Vitest
- React Testing Library

## Architecture

```text
User
  |
  v
Frontend (React + Vite on Vercel)
  |
  | Authenticated API requests using Clerk token
  v
Backend (Node.js + Express on Render)
  |
  | Prisma ORM
  v
PostgreSQL Database (Neon)
```

## Project Structure

```text
volunteer management system/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/volunteer/
│   │   ├── lib/
│   │   └── main.jsx
│   ├── .env
│   └── package.json
├── server/                 # Backend application
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── lib/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Modules Implemented

### 1. Authentication
- Clerk sign in and session management
- frontend token handling
- backend route protection

### 2. Volunteer Profile
- view personal information
- edit profile details
- save profile to backend
- add and remove skills

### 3. Event Details
- fetch event data from backend
- show event date, time, location, category, organizer, and skills
- allow signed-in users to apply

### 4. Applications
- fetch current user applications
- open detailed view of a single application
- withdraw pending or approved applications

## Database Design

The backend uses PostgreSQL with Prisma. Main models include:

- `User`
- `VolunteerProfile`
- `Skill`
- `VolunteerSkill`
- `Organization`
- `Event`
- `EventSkill`
- `Application`

These tables support profile management, event listing, application tracking, and skill mapping.

## API Endpoints

### Public
- `GET /`
- `GET /api/health`
- `GET /api/events`
- `GET /api/events/:eventId`

### Protected
- `GET /api/me/profile`
- `PUT /api/me/profile`
- `POST /api/events/:eventId/applications`
- `GET /api/me/applications`
- `GET /api/me/applications/:applicationId`
- `DELETE /api/me/applications/:applicationId`

## Local Setup

## Prerequisites

- Node.js
- npm
- PostgreSQL database or Neon database
- Clerk account

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd "volunteer management system"
```

## 2. Install frontend dependencies

```bash
cd client
npm install
```

## 3. Install backend dependencies

```bash
cd ../server
npm install
```

## 4. Configure environment variables

### Frontend: `client/.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:4000/api
```

### Backend: `server/.env`

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL="your_postgresql_connection_string"
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## 5. Generate Prisma client

```bash
cd server
npm run prisma:generate
```

## 6. Run database migrations

```bash
npm run prisma:migrate
```

If Prisma asks for a migration name, you can use:

```bash
init
```

## 7. Seed sample data

```bash
npm run seed
```

This inserts sample organizations, events, and skills so the app has usable data immediately.

## 8. Start the backend

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:4000
```

## 9. Start the frontend

Open a new terminal:

```bash
cd client
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## Root Scripts

From the project root:

```bash
npm run client
npm run server
```

## Testing

Run frontend tests:

```bash
cd client
npm run test
```

Focused tests currently cover:

- profile save flow
- skill add flow
- applications list and details flow
- withdraw flow
- topbar rendering

## Deployment

### Frontend Deployment
- Platform: Vercel
- Root directory: `client`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Required frontend environment variables:

```env
VITE_API_URL=https://your-backend-url/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Backend Deployment
- Platform: Render
- Service type: `Web Service`
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm run start`

Required backend environment variables:

```env
DATABASE_URL=your_neon_connection_string
CLIENT_ORIGIN=https://your-frontend-url
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NODE_VERSION=22
```

### Database
- Platform: Neon
- Database: PostgreSQL

## Live URLs for Submission

- Project frontend: `https://volunteerhub-tau.vercel.app/profile`
- Project backend: `https://volunteerhub-sjch.onrender.com/`
- Backend health endpoint: `https://volunteerhub-sjch.onrender.com/api/health`

## Live Flow

Once deployed, the user flow is:

1. Sign in using Clerk
2. Open the event page
3. Apply to an event
4. Open applications page
5. View application details
6. Withdraw application if needed
7. Edit and save volunteer profile
8. Add or remove skills

## Future Scope

- organizer dashboard
- admin panel
- event creation and management
- attendance marking
- certificate generation
- notifications and email updates
- analytics and reporting

## Academic Relevance

This project demonstrates:

- full-stack web development
- REST API design
- authentication and authorization
- relational database schema design
- ORM-based backend development
- cloud deployment
- frontend-backend integration
- testing of user-facing flows

## Important Note

Do not commit real secrets or production credentials to GitHub. Use environment variables for all sensitive values such as:

- Clerk secret key
- database connection string
- deployment-specific credentials

If any secret key is exposed during development, rotate it immediately.

## Conclusion

VolunteerHub is a practical full-stack web application that showcases how modern technologies can be used to solve volunteer coordination problems. It is suitable for a minor project because it includes real authentication, a working backend, persistent database storage, deployment, and complete user-facing flows.
