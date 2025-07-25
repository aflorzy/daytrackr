# DayTrackr NX Monorepo Setup

This document provides an overview of the DayTrackr monorepo structure, configuration, and best practices.

## Project Structure

- **NX Monorepo**: Using NX 19.6.x for compatibility with Angular 18
- **Web App**: Angular 18.2.x application in `apps/web`
- **API App**: Spring Boot 3.0.6 application in `apps/api`

## Configuration Highlights

### Dependency Management
- All web dependencies migrated to the root `package.json`
- Maven is used for API app dependency management via `pom.xml`

### Application Configuration
- Spring Boot uses YAML format with environment profiles
- Profiles:
  - `dev`: Development environment (default)
  - `prd`: Production environment

### Build & Run Commands

#### Web App
```bash
# Development
npx nx serve web

# Production build
npx nx build web --configuration=production
```

#### API App
```bash
# Development (using Java 17)
sdk env  # Activate Java 17 via SDKMAN
npx nx serve api

# Production build
npx nx build api --configuration=production
```

### Docker Support

Both applications include Docker support:

- **API**: Uses eclipse-temurin:17-jdk-jammy with entrypoint script
- **Web**: Uses nginx:stable-alpine with custom SPA routing config

### CI/CD with Gitea Actions

The CI/CD pipeline uses Gitea Actions (GitHub Actions compatible):

1. **PR Validation**: Lints and builds affected projects
2. **Main Branch**: Builds, tests, and pushes Docker images
3. **Caching**: Optimizes builds with caching for node_modules and NX

## Best Practices

### Java Version Management
- Use SDKMAN with `.sdkmanrc` to enforce Java 17
- Run `sdk env` to activate the correct Java version

### Spring Boot Configuration
- Use YAML format with profiles instead of properties files
- Minimize environment variable usage with sensible defaults
- Move from Hibernate's `ddl-auto: update` to Flyway migrations (planned)

### NX Commands
- Use consistent commands across applications:
  - `nx serve <app>`: Start in development mode
  - `nx build <app> --configuration=production`: Build for production
  - `nx test <app>`: Run tests
  - `nx affected --target=<command>`: Run commands only on affected projects

## Future Improvements

1. Migrate from Hibernate DDL auto-update to Flyway migrations
2. Upgrade Angular from 18.x to 20.x
3. Upgrade NX to 21.x (after Angular upgrade)
4. Re-integrate @nxrocks/nx-spring-boot plugin after NX upgrade
5. Implement comprehensive test automation for both apps
