# DayTrackr

A personal day-tracking application built as an NX monorepo.

## Apps

| App | Path | Stack |
|-----|------|-------|
| Web | `apps/web` | Angular 18, NgRx, SCSS |
| API | `apps/api` | Spring Boot 3, Java 17, MySQL |

## Prerequisites

- Node.js 24
- Java 17 (managed via SDKMAN — run `sdk env` to activate)
- MySQL running locally on port 3306

## Getting Started

```bash
# Install Node dependencies
npm ci

# Activate Java 17
sdk env

# Start the API (http://localhost:8080)
npx nx serve api

# Start the web app (http://localhost:4200)
npx nx serve web
```

## Common Commands

```bash
# Run tests
npx nx test web
npx nx test api

# Lint
npx nx lint web

# Production build
npx nx build web --configuration=production
npx nx build api --configuration=production

# Run only affected projects (useful before pushing)
npx nx affected --target=lint
npx nx affected --target=build --configuration=production
```

## Database

The dev profile connects to `localhost:3306/daytrackr` (username: `aflorzy`, password: `password`). The database is created automatically on first run.

Schema is managed by Flyway. Migrations live in `apps/api/src/main/resources/db/migration/`.

## CI/CD

Gitea Actions (`.gitea/workflows/ci.yml`) handles:
- **Pull requests** — lints and builds affected projects
- **Main branch** — builds Docker images, pushes to the container registry, and triggers a staging deployment
