# DiaCheck AI

DiaCheck AI is a full-stack diabetes prediction web app with:

- React frontend built with Next.js
- Express backend API
- PostgreSQL database on Neon
- Prisma ORM
- JWT authentication
- bcrypt password hashing
- User-specific prediction history

## Features

- Signup and login with hashed passwords
- JWT-based protected API routes
- Diabetes prediction form with the required clinical fields
- Rule-based prediction logic:
  - `Diabetic` when `glucose > 140` or `bmi > 30`
  - `Not Diabetic` otherwise
- Saved prediction history per user
- Record detail view
- Responsive dashboard and auth UI
- Loading and error states
- Logout support

## Project Structure

```text
server/
  prisma/
    schema.prisma
  src/
    controllers/
    middleware/
    prisma/
    routes/
    utils/

src/
  app/
  components/
  lib/
```

The frontend already existed as a Next.js app in this repository, so the React client lives under `src/`.

## Environment Variables

Create a `.env` file in the project root using `.env.example`:

```env
DATABASE_URL="postgresql://neondb_owner:npg_sOrBRKJP07zd@ep-sweet-boat-anc062vj-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=4000
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000/api"
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Generate the Prisma client:

```bash
npm run prisma:generate
```

3. Push the schema to Neon:

```bash
npm run prisma:push
```

4. Start the Express backend:

```bash
npm run dev:server
```

5. In another terminal, start the frontend:

```bash
npm run dev:client
```

6. Open `http://localhost:3000`

## Available Scripts

- `npm run dev:client` starts the Next.js frontend
- `npm run dev:server` starts the Express backend with file watching
- `npm run server` starts the Express backend once
- `npm run build` builds the frontend for production
- `npm run prisma:generate` generates the Prisma client
- `npm run prisma:push` syncs the schema to the database
- `npm run prisma:migrate` creates a Prisma migration during development

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Diabetes

Protected with JWT bearer auth:

- `POST /api/diabetes/predict`
- `GET /api/diabetes/history`
- `GET /api/diabetes/:id`

## Verification

The following checks were completed:

- `npm run prisma:generate`
- `npm run prisma:push`
- `npm run build`
