# Sales Management & Evaluation App

Full-stack technical assessment project implemented with a simple layered architecture.

## Features

- Create a sale (`customer`, `product`, `amount`)
- List sales (`customer`, `product`, `amount`, `score`)
- Evaluate a sale with score `1..5`
- Basic validation and API/UI feedback
- Average score summary for evaluated sales

## Stack

- Backend: Node.js + Express + TypeScript
- Frontend: Next.js (App Router) + TypeScript
- Database: SQLite
- ORM: Prisma
- Runtime: Docker Compose
- Tests: Vitest + Supertest (backend)

## Project Structure

```text
.
├── backend
│   ├── prisma/schema.prisma
│   ├── src
│   │   ├── presentation
│   │   ├── application
│   │   ├── domain
│   │   ├── infrastructure
│   │   └── shared
│   └── tests/integration
├── frontend
│   ├── app
│   ├── components
│   ├── services/api
│   ├── types
│   └── lib
└── docker-compose.yml
```

## API

Base URL:
- `http://localhost:4000`

The same routes are also available under `/api` for compatibility (for example `/api/sales`).

### `GET /sales`
Returns all sales.

### `POST /sales`
Creates a sale.

Request body:
```json
{
  "customer": "Acme Corp",
  "product": "Premium Plan",
  "amount": 1200
}
```

Validation:
- `customer` required
- `product` required
- `amount` required, numeric, `> 0`

### `POST /sales/:id/evaluate`
Assigns a score to an existing sale.

Request body:
```json
{
  "score": 4
}
```

Validation:
- `score` required
- `score` integer between `1` and `5`
- returns `404` when sale does not exist

## Run With Docker

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

## Run Locally

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

## Tests

Backend tests:

```bash
cd backend
npm test
```

Covered cases:
- creating a valid sale
- rejecting invalid sale creation
- listing sales
- evaluating an existing sale
- rejecting invalid score
- returning 404 for non-existing sale evaluation

## Design Notes (Pragmatic SOLID + GRASP + Clean Code)

- **Single Responsibility**: controllers only orchestrate HTTP concerns; use cases contain application behavior; repositories isolate persistence.
- **Dependency Inversion**: use cases depend on `SaleRepository` contract, not Prisma.
- **Manual DI**: composition root in `backend/src/infrastructure/di/container.ts`.
- **Controller thinness**: validation and request parsing are handled through DTO schemas + validation middleware.
- **Error flow**: domain/application errors bubble up to centralized middleware for consistent HTTP responses.
- **GRASP (Controller, Information Expert, Low Coupling)**:
  - Presentation controllers coordinate requests.
  - Repository implementations own DB details.
  - Use cases keep domain/application rules independent from framework/persistence.
- **REST clarity**: resources and actions are explicit and minimal for the scope.

## Scope Intentionally Not Included

- Authentication / authorization
- Roles / permissions
- Extra dashboards/modules beyond required scope
