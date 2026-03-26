# Sales Evaluation App - Scaffold

Production-like scaffold for a technical assessment with:

- Backend: Node.js + Express + TypeScript
- Frontend: Next.js (App Router) + TypeScript
- Database: SQLite
- ORM: Prisma
- Runtime: Docker Compose

## Project Structure

```text
.
├── backend
│   ├── prisma
│   │   └── schema.prisma
│   ├── src
│   │   ├── presentation
│   │   ├── application
│   │   ├── domain
│   │   ├── infrastructure
│   │   ├── shared
│   │   ├── app.ts
│   │   └── main.ts
│   ├── tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── frontend
│   ├── app
│   ├── components
│   ├── services
│   ├── types
│   ├── lib
│   ├── tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .editorconfig
└── .gitignore
```

## Quick Start

### Run with Docker

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Health endpoint: http://localhost:4000/api/health

## Backend Notes

- Layered architecture: presentation, application, domain, infrastructure, shared.
- Manual dependency injection in `src/infrastructure/di/container.ts`.
- Prisma configured for SQLite with `Sale` model.
- Base REST endpoints scaffolded:
  - `GET /api/health`
  - `GET /api/sales`
  - `POST /api/sales`

## Frontend Notes

- Next.js App Router structure ready for:
  - sales list UI
  - create sale UI
  - evaluate sale UI
- API layer scaffolded in `services/api`.
- `NEXT_PUBLIC_API_BASE_URL` drives backend connection.

## Local (without Docker)

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Pending Business Implementation

- Sales business rules/evaluation scoring logic.
- Complete sales CRUD and richer validation flows.
- UI forms, data fetching states, and submission handling.
- Automated tests (unit/integration/e2e).
