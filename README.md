# Neural Nexas — Healthcare Platform

A full MERN stack healthcare web app with:
- **Frontend** — React 18 + TypeScript + Vite + Tailwind CSS + Wouter + TanStack Query
- **Backend** — Node.js + Express + TypeScript + MongoDB + Mongoose + JWT

---

## Folder Structure

```
root/
  client/          React frontend (port 3000)
  server/          Express API backend (port 8080)
  package.json     Root scripts (runs both with concurrently)
  .env             Your environment variables (create from .env.example)
```

---

## Setup & Run

### 1. Clone / download the project

### 2. Create your `.env` file
```bash
cp .env.example .env
```
Then open `.env` and replace the placeholder with your actual MongoDB connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neuralnexas
JWT_SECRET=any-long-random-secret
PORT=8080
```

> **Get a free MongoDB URI** — create a free cluster at [mongodb.com/atlas](https://cloud.mongodb.com)  
> Click Connect → Drivers → copy the connection string

### 3. Install all dependencies
```bash
npm run install-all
```

### 4. Start the app
```bash
npm run dev
```

This starts both the backend and frontend simultaneously.

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:8080  |

---

## Default Admin Account
After seeding (automatic on first run):
- **Email:** admin@neuralnexas.com
- **Password:** admin123

---

## Individual Commands

```bash
npm run server   # Start backend only
npm run client   # Start frontend only
npm run dev      # Start both
```

---

## Features
- Patient, Doctor, and Admin dashboards
- Appointment booking and management
- Medical records management
- Prescription history
- Emergency alert system
- Nearby healthcare services
- Medical store / pharmacy ordering
- JWT authentication with role-based access
