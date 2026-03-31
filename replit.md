# Neural Nexas — Smart Healthcare System

## Overview

A full-stack healthcare web application built with React + TypeScript (frontend) and Express + TypeScript (backend) with MongoDB/Mongoose.

## Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + TanStack Query + Wouter
- **Backend**: Express 5 + TypeScript + Mongoose (MongoDB)
- **Auth**: JWT (stored in localStorage as `nn_token`)
- **API codegen**: Orval (OpenAPI → React Query hooks)
- **Validation**: Zod

## Structure

```
artifacts/neural-nexas/   # React frontend
  src/
    pages/                # All page components
    components/           # Navbar, ProtectedRoute, StatusBadge
    lib/                  # auth.ts (JWT helpers)
    App.tsx               # Router setup
    main.tsx              # Entry point, sets JWT getter

artifacts/api-server/     # Express backend
  src/
    models.ts             # All Mongoose models
    routes.ts             # All API routes
    middleware.ts         # JWT authenticate, requireRole
    seed.ts               # Demo data seeder
    app.ts                # Express app + MongoDB connect
    index.ts              # Server entry point

lib/api-spec/openapi.yaml # OpenAPI spec (source of truth)
lib/api-client-react/     # Generated React Query hooks
lib/api-zod/              # Generated Zod validators
```

## Features

- **Auth**: Register/Login with roles (patient, doctor, admin)
- **Patient Dashboard**: Upcoming appointments, prescriptions, quick actions
- **Doctor Dashboard**: Today's schedule, create prescriptions
- **Admin Dashboard**: System stats (users, appointments, orders, revenue)
- **Appointment Booking**: Browse verified doctors, book in-person/online/zero-wait
- **Medical Records**: Upload and view records by type
- **Prescriptions**: Full prescription history with medications
- **Nearby Services**: Hospitals, pharmacies, clinics, diagnostic centers
- **Emergency Button**: Trigger alert with nearest hospital + ETA
- **Medical Store**: Order medicines from pharmacies

## Required Secret

Set `MONGODB_URI` in Secrets (use the Secrets tab):
```
mongodb+srv://username:password@cluster.mongodb.net/neuralnexas
```
Get a free MongoDB Atlas cluster at mongodb.com/atlas.

## Default Seed Account (after MongoDB connected)

- **Admin**: admin@neuralnexas.com / admin123

## API Routes

- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET  /api/auth/me` — Current user (JWT required)
- `GET  /api/doctors` — List doctors
- `GET/POST /api/appointments` — Appointments (JWT)
- `GET/POST /api/prescriptions` — Prescriptions (JWT)
- `GET/POST /api/records` — Medical records (JWT)
- `GET  /api/stores` — Nearby stores/hospitals
- `GET/POST /api/orders` — Medicine orders (JWT)
- `POST /api/emergency` — Emergency trigger (JWT)
- `GET  /api/admin/stats` — Admin stats (admin role)
- `GET  /api/admin/users` — All users (admin role)
