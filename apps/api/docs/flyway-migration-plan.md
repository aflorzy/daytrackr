# Migrating from Hibernate DDL-Auto to Flyway Migrations

## Overview
This document outlines the plan for migrating the DayTrackr API from using Hibernate's `ddl-auto: update` to Flyway for database schema migrations.

## Benefits of Flyway
- **Version Control**: Track all database changes in version-controlled migration scripts
- **Repeatable Deployments**: Ensure consistent database schema across all environments
- **Safer Production Deployments**: Explicit migrations instead of automatic schema generation
- **Schema History Table**: Maintain a record of all applied migrations
- **Test Migrations**: Ability to test migrations before deploying to production

## Implementation Steps

### 1. Add Flyway Dependencies
Add to `pom.xml`:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

### 2. Configure Flyway in application.yml
```yaml
spring:
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration
    validate-on-migrate: true
```

### 3. Create Initial Schema Migration
Generate the initial schema migration by:

1. Run the application once with `ddl-auto: update` to ensure the schema is up-to-date
2. Use a database tool to export the current schema as SQL
3. Create the first migration file: `V1__Initial_Schema.sql`
4. Place it in `src/main/resources/db/migration/`

### 4. Change Hibernate Configuration
Update `application.yml`:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Change from 'update' to 'validate'
```

### 5. Create Migration Process

#### For New Features
1. Create a new migration script for each database change
2. Use naming convention: `V{version}__{description}.sql`
3. Example: `V2__Add_User_Preferences_Table.sql`

#### Testing Migrations
1. Use an in-memory database or Docker container for testing
2. Verify migrations run successfully
3. Add integration tests that verify the schema is as expected

### 6. CI/CD Integration
1. Add a step in the entrypoint.sh to run Flyway migrations before starting the app:
```bash
./mvnw flyway:migrate -Dflyway.url="$SPRING_DATASOURCE_URL" \
  -Dflyway.user="$SPRING_DATASOURCE_USERNAME" \
  -Dflyway.password="$SPRING_DATASOURCE_PASSWORD"
```

2. Add a Flyway check in the CI pipeline:
```yaml
- name: Validate Flyway Migrations
  run: mvn flyway:validate
```

## Best Practices

1. **One Change Per Migration**: Each migration script should make only one logical change
2. **Idempotent Scripts**: When possible, make scripts that can be run multiple times without error
3. **Use Transactions**: Wrap migrations in transactions when possible
4. **Test Migrations**: Always test migrations locally before pushing to version control
5. **Avoid Application Logic**: Keep migration scripts focused on schema changes only

## Migration Checklist
- [ ] Add Flyway dependencies to pom.xml
- [ ] Configure Flyway in application.yml
- [ ] Generate initial schema migration
- [ ] Change Hibernate from 'update' to 'validate'
- [ ] Update entrypoint.sh to run migrations on startup
- [ ] Update CI/CD pipeline to validate migrations
- [ ] Test complete process in development environment
