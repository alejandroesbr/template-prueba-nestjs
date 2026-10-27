# NestJS Modular Architecture Boilerplate (Package by Feature)

A production-ready, stack-agnostic **NestJS** starter template engineered around the **Package by Feature (Modular Architecture)** pattern. Designed for rapid feature delivery, high local cohesion, strict input validation, standardized HTTP responses, Docker containerization, and interactive OpenAPI (Swagger) documentation.

---

## Table of Contents

1. [Architectural Philosophy & Justification (YAGNI)](#1-architectural-philosophy--justification-yagni)
2. [Project Structure](#2-project-structure)
3. [Request & Error Data Flow](#3-request--error-data-flow)
4. [Prerequisites](#4-prerequisites)
5. [Installation & Local Setup](#5-installation--local-setup)
6. [Docker & Database Profiles](#6-docker--database-profiles)
7. [Environment Variables](#7-environment-variables)
8. [API Documentation (Swagger)](#8-api-documentation-swagger)
9. [Creating New Feature Modules](#9-creating-new-feature-modules)
10. [Testing & Maintenance](#10-testing--maintenance)

---

## 1. Architectural Philosophy & Justification (YAGNI)

> *"This project prioritizes **pragmatism, high local cohesion, and delivery speed** by adopting a **Package by Feature (Modular Architecture)** aligned with NestJS's native module system (`@Module()`).*
>
> *Every business capability resides within a self-contained directory under `src/modules/` that encapsulates its own HTTP controllers, business services, validation DTOs, and persistence entities. Internally, each feature follows a clean 3-layer separation (Presentation, Business Logic, and Persistence) while deliberately avoiding premature abstractions—such as redundant repository interfaces or intermediate mappers—in accordance with the **YAGNI (You Aren't Gonna Need It)** principle.*
>
> *This design guarantees clean, maintainable, and testable code today while allowing any individual module to seamlessly evolve into **CQRS**, **Clean Architecture**, or **Microservices / API Gateway** patterns if domain complexity demands it."*

### Key Design Principles

- **High Local Cohesion**: Files that change together for business reasons live together in the same physical directory.
- **3-Layer Internal Structure per Feature**:
  1. **Presentation / Entry Layer**: HTTP Controllers (`*.controller.ts`) and Validation DTOs (`dto/*.dto.ts`).
  2. **Business Logic & Coordination Layer**: Injectable Services (`*.service.ts`) or Command/Query Handlers.
  3. **Persistence & Data Layer**: ORM Entities / Schemas (`entities/*.entity.ts`).
- **Cross-Cutting Standardization (`src/common/`)**: Global validation, uniform JSON envelopes, centralized exception handling, and reusable authentication guards.

---

## 2. Project Structure

```text
src/
├── common/                              # Global cross-cutting utilities
│   ├── decorators/
│   │   └── public.decorator.ts          # @Public() decorator to bypass auth guards
│   ├── dto/
│   │   └── pagination-query.dto.ts      # Reusable pagination & sorting query DTO
│   ├── filters/
│   │   └── http-exception.filter.ts     # Global HTTP & unhandled exception JSON formatter
│   ├── guards/
│   │   └── jwt-auth.guard.ts            # Extensible Auth Guard (JWT, Better Auth, OAuth2)
│   └── interceptors/
│       └── response.interceptor.ts      # Uniform JSON envelope for successful responses
│
├── modules/                             # Self-contained domain/feature modules
│   └── _template/                       # Blueprint module for rapid scaffolding
│       ├── dto/
│       │   ├── create-item.dto.ts       # Input validation schema for creation
│       │   └── update-item.dto.ts       # Partial validation schema for updates
│       ├── entities/
│       │   └── item.entity.ts           # Database entity / OpenAPI schema model
│       ├── item.controller.ts           # REST endpoints & Swagger annotations
│       ├── item.service.ts              # Business rules & persistence coordination
│       ├── item.service.spec.ts         # Unit test blueprint
│       └── item.module.ts               # NestJS feature module definition
│
├── app.module.ts                        # Root module (Config, DB hooks, Feature registration)
└── main.ts                              # Application bootstrap (Helmet, CORS, Pipes, Swagger)
```

---

## 3. Request & Error Data Flow

```text
[ HTTP Client / Postman / Frontend ]
       │
       ▼
1. main.ts (Security & Global ValidationPipe)
   └── Applies Helmet headers, CORS policy, and validates/sanitizes incoming JSON payloads
       against the feature DTO using `class-validator`. Rejects invalid payloads with HTTP 400.
       │
       ▼
2. Guard (src/common/guards/jwt-auth.guard.ts)
   └── Verifies authentication credentials (JWT, Better Auth session, or OAuth2 token)
       unless the route is decorated with `@Public()`.
       │
       ▼
3. Controller (Presentation Layer)
   └── Extracts validated DTOs and parameters (@Body, @Param, @Query) and delegates
       execution to the corresponding Service method.
       │
       ▼
4. Service (Business Logic & Coordination Layer)
   └── Enforces domain rules, orchestrates transactions, or dispatches commands/queries
       to the underlying ORM repository or external microservice.
       │
       ▼
5. Repository / Entity (Persistence Layer)
   └── Executes optimized database queries and returns results to the Service.
       │
       ▼
6. ResponseInterceptor / HttpExceptionFilter -> Client
   └── Wraps successful responses in a standard envelope (`{ success: true, statusCode, data, timestamp }`)
       or formats thrown exceptions into a clean error JSON (`{ success: false, statusCode, error, message, path, timestamp }`).
```

---

## 4. Prerequisites

- **Node.js**: `v20.x` or `v22.x` LTS (or higher)
- **Package Manager**: `npm` or `pnpm`
- **Docker & Docker Compose**: Required for containerized execution and database services

---

## 5. Installation & Local Setup

1. **Clone the repository and install dependencies**:

```bash
npm install
```

2. **Configure environment variables**:

```bash
cp .env.example .env
```

3. **Start the development server (with hot-reload)**:

```bash
npm run start:dev
```

4. **Verify service health**:

```bash
curl http://localhost:3000/api/v1/health
```

---

## 6. Docker & Database Profiles

This template includes a multi-stage `Dockerfile` (`development` and `production` targets) and a modular `docker-compose.yml` using **Docker Compose Profiles** so you can spin up only the infrastructure required by your stack:

```bash
# Run only the NestJS API container (standalone)
docker compose up -d --build

# Run NestJS API + PostgreSQL 16
docker compose --profile postgres up -d --build

# Run NestJS API + MySQL 8
docker compose --profile mysql up -d --build

# Run NestJS API + MongoDB 7
docker compose --profile mongo up -d --build

# Run NestJS API + Redis 7 (Caching / Microservices / BullMQ)
docker compose --profile redis up -d --build

# Run NestJS API + PostgreSQL + Redis
docker compose --profile full up -d --build
```

To stop all running containers and remove volumes:

```bash
docker compose --profile full down -v
```

---

## 7. Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | `development` |
| `PORT` | HTTP server listening port | `3000` |
| `API_PREFIX` | Global URI prefix for all routes | `api/v1` |
| `CORS_ORIGIN` | Allowed CORS origins (`*` or comma-separated URLs) | `*` |
| `SWAGGER_ENABLED` | Enables or disables OpenAPI documentation UI | `true` |
| `SWAGGER_PATH` | URL path where Swagger UI is mounted | `docs` |
| `DB_TYPE` | Database driver (`postgres`, `mysql`, `mongodb`, `sqlite`) | `postgres` |
| `DB_HOST` | Database hostname | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `app_db` |
| `DATABASE_URL` | Full connection URI (used by Prisma / Mongoose) | `postgresql://...` |
| `JWT_SECRET` | Secret key for signing/verifying JWT tokens | `super-secret...` |

---

## 8. API Documentation (Swagger)

Interactive OpenAPI 3.0 documentation is automatically generated and served at:

- **Swagger UI**: `http://localhost:3000/docs`
- **OpenAPI JSON Spec**: `http://localhost:3000/docs-json`

It includes built-in **Bearer Authentication** support (`persistAuthorization: true`) to test protected endpoints directly from the browser.

---

## 9. Creating New Feature Modules

You can create a new feature module in two ways:

### Option A: Using the NestJS CLI (Recommended for Speed)

```bash
npx nest g resource modules/products --no-spec
```

### Option B: Copying the `_template` Blueprint

Copy `src/modules/_template` to `src/modules/<feature-name>`, rename `Item` to your domain entity, and register the new module in `src/app.module.ts`.

---

## 10. Testing & Maintenance

```bash
# Run unit tests
npm run test

# Run unit tests with coverage report
npm run test:cov

# Run End-to-End (E2E) integration tests
npm run test:e2e

# Format codebase with Prettier
npm run format

# Build for production
npm run build
```

