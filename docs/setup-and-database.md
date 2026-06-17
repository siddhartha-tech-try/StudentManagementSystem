# Setup and Database Guide

## Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer
- Git

## Fresh Clone Setup

```bash
git clone <repository-url>
cd StudentManagementSystem
npm run install:all
```

Create the backend environment file:

```bash
cd server
cp .env.example .env
```

Set `DATABASE_URL` in `server/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/student_management?schema=public"
PORT=4000
CLIENT_URL="http://localhost:5173"
MAX_FILE_SIZE_MB=2
```

Create the PostgreSQL database if it does not already exist:

```bash
createdb student_management
```

Run the migration and optional seed:

```bash
cd server
npm run prisma:migrate
npm run seed
```

Start the API:

```bash
npm run dev
```

Start the UI in another terminal:

```bash
cd client
npm run dev
```

## Database Design

### `Student`

Stores student profile details:

- UUID primary key
- Auto-generated unique `admissionNumber`
- Name, course, year, date of birth, email, mobile number, gender, address
- Optional `photoUrl`
- Created and updated timestamps

Indexes are added for admission number, name, email, mobile number, course, year, gender, and created date.

### `ActivityLog`

Stores create, update, and delete actions:

- UUID primary key
- Action: `CREATE`, `UPDATE`, or `DELETE`
- Entity type and entity id
- Admission number snapshot
- Message and optional JSON metadata
- Created timestamp

Indexes are added for action, entity type, entity id, admission number, and created date.

## Admission Number Generation

The migration creates a PostgreSQL sequence named `student_admission_sequence`. The API calls `nextval` in the same database transaction used to create the student, then formats the result as:

```text
ADM-YYYY-000001
```

The `Student.admissionNumber` column also has a unique constraint.

## Photo Uploads

Photos are stored under:

```text
server/uploads/students/
```

The API stores a public path such as:

```text
/uploads/students/filename.webp
```

The Express app serves uploaded files from `/uploads`.

Allowed image types:

- JPG
- PNG
- WEBP

Default max size: `2 MB`, configurable with `MAX_FILE_SIZE_MB`.

## Validation Rules

Frontend and backend validation both enforce:

- Required name, course, year, date of birth, email, mobile number, gender, and address
- Valid email format
- Mobile number with 10 to 15 digits and optional leading `+`
- Year from 1 to 8
- Date of birth cannot be in the future
- Gender must be `MALE`, `FEMALE`, or `OTHER`

## Verification Commands

Backend:

```bash
cd server
npm run build
```

Frontend:

```bash
cd client
npm run build
```

Full build from the repository root:

```bash
npm run build
```

## Troubleshooting

- If Prisma cannot connect, verify PostgreSQL is running and `DATABASE_URL` is correct.
- If migrations fail because the database does not exist, create it first with `createdb student_management`.
- If uploaded photos do not load, verify the API server is running and `VITE_API_URL` points to `http://localhost:4000/api`.
- In Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.
