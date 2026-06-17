# Student Management System

A full-stack student management system built with React, Express, Prisma, and PostgreSQL. It supports student CRUD, photo uploads, server-side pagination, search/filter, analytics, activity logging, validation, and a responsive admin UI.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, React Query, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Uploads: Local file storage served from the Express server

## Project Structure

```text
.
├── client/              # React admin UI
├── server/              # Express API and Prisma schema
├── docs/                # Setup, database, and API documentation
├── package.json         # Root helper scripts
└── README.md
```

## Quick Start

1. Install dependencies:

```bash
npm run install:all
```

2. Configure the backend:

```bash
cd server
cp .env.example .env
```

Update `DATABASE_URL` in `server/.env` to point to your PostgreSQL database.

3. Create the database schema:

```bash
cd server
npm run prisma:migrate
npm run seed
```

4. Start the backend:

```bash
npm run dev:server
```

5. Start the frontend in a second terminal:

```bash
npm run dev:client
```

Default URLs:

- Frontend: `http://localhost:5173`
- API: `http://localhost:4000/api`
- Uploaded photos: `http://localhost:4000/uploads/...`

## Main Features

- Add, edit, view, search, filter, paginate, and delete student records
- Upload student photos with JPG, PNG, and WEBP validation
- Auto-generate unique admission numbers in the format `ADM-YYYY-000001`
- Dashboard analytics for totals, recent admissions, course distribution, and gender mix
- Activity log for create, update, and delete operations
- Frontend and backend validation with matching rules
- Responsive admin UI for desktop, tablet, and mobile

## Scripts

Root scripts:

```bash
npm run install:all
npm run dev:server
npm run dev:client
npm run build
```

Backend scripts:

```bash
cd server
npm run dev
npm run build
npm run prisma:migrate
npm run prisma:studio
npm run seed
```

Frontend scripts:

```bash
cd client
npm run dev
npm run build
npm run preview
```

## Documentation

- [API Reference](docs/api-reference.md)
- [Setup and Database Guide](docs/setup-and-database.md)
