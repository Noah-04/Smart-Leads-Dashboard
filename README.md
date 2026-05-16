# Smart Leads Dashboard

A full-stack MERN application for managing leads, built with TypeScript on both frontend and backend.

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control (Admin & Sales User)
- Lead CRUD with status and source filters
- Debounced search, sorting, and backend pagination
- CSV export
- Dark mode and responsive UI
- Docker support

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, TailwindCSS, Vite, React Hook Form, Zod, Lucide Icons |
| Backend | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod |

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or Docker)

### Run with Docker (recommended)

```bash
cp .env.example .env
docker compose up --build
```

Frontend → `http://localhost:5173` · Backend → `http://localhost:5000`

### Run Locally

**Backend:**

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Frontend** (in a second terminal):

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

> On Windows use `Copy-Item .env.example .env` instead of `cp`.

## Environment Variables

| File | Purpose |
| --- | --- |
| `.env` | Docker Compose |
| `backend/.env` | Local backend |
| `frontend/.env` | Local frontend (Vite) |

Copy each `.env.example` to `.env` and update values as needed.

## Roles & Permissions

| Role | Permissions |
| --- | --- |
| Admin | Full CRUD on leads, including delete |
| Sales User | Create, view, update leads — **cannot delete** |

Public registration creates a Sales User. The first Admin is created via the seed script.

### Default Admin Credentials

```
Email:    admin@company.com
Password: Admin@123
```

The seed runs automatically with `npm run dev`. To run it manually:

```bash
cd backend
npm run seed
```

## API Overview

Base URL: `/api/v1`

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a new Sales User |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Get current user (requires token) |

### Leads (all routes require JWT)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/leads` | Create a lead |
| GET | `/leads` | List leads (supports `page`, `status`, `source`, `search`, `sort`) |
| GET | `/leads/:id` | Get a single lead |
| PATCH | `/leads/:id` | Update a lead |
| DELETE | `/leads/:id` | Delete a lead (Admin only) |
| GET | `/leads/export/csv` | Export leads as CSV |

**Lead statuses:** New, Contacted, Qualified, Lost
**Lead sources:** Website, Instagram, Referral

## Project Structure

```
├── backend/src
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── seed.ts
│   └── server.ts
├── frontend/src
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── App.tsx
├── docker-compose.yml
└── README.md
```

## Key Design Decisions

- TypeScript strict mode on both sides — no `any` usage
- Zod for request/query validation on the backend
- Centralized error handling with consistent JSON responses
- Admin seeded via script (not exposed through public registration)
- Frontend session persists across refresh until logout
