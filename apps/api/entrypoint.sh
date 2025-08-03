#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Set default profile to 'dev' if not provided (moved up for logic flow)
if [ -z "$SPRING_PROFILES_ACTIVE" ]; then
  export SPRING_PROFILES_ACTIVE=dev
  echo "No profile specified. Using default profile: $SPRING_PROFILES_ACTIVE"
else
  echo "Using profile: $SPRING_PROFILES_ACTIVE"
fi

# Run Flyway baseline first (to handle existing databases without schema history)
echo "Running Flyway baseline..."
if ./mvnw flyway:baseline -Dflyway.url="$SPRING_DATASOURCE_URL" -Dflyway.user="$SPRING_DATASOURCE_USERNAME" -Dflyway.password="$SPRING_DATASOURCE_PASSWORD"; then
  echo "Flyway baseline completed successfully."
else
  BASELINE_EXIT_CODE=$?
  echo "Flyway baseline failed with exit code $BASELINE_EXIT_CODE"
  # If baseline fails, it might be because the schema history table already exists
  # This is actually OK - we can proceed to migrations
  echo "Baseline failure might indicate schema history table already exists. Continuing..."
fi

# Run Flyway migrations
echo "Running Flyway migrations..."
# Attempt to run migrations, with error handling
if ./mvnw flyway:migrate -Dflyway.url="$SPRING_DATASOURCE_URL" -Dflyway.user="$SPRING_DATASOURCE_USERNAME" -Dflyway.password="$SPRING_DATASOURCE_PASSWORD"; then
  echo "Flyway migrations completed successfully."
else
  MIGRATION_EXIT_CODE=$?
  echo "Warning: Flyway migration failed with exit code $MIGRATION_EXIT_CODE"
  
  # If in development mode, offer to repair the database
  if [ "$SPRING_PROFILES_ACTIVE" = "dev" ]; then
    echo "Development mode detected. Attempting to repair Flyway metadata..."
    ./mvnw flyway:repair -Dflyway.url="$SPRING_DATASOURCE_URL" -Dflyway.user="$SPRING_DATASOURCE_USERNAME" -Dflyway.password="$SPRING_DATASOURCE_PASSWORD"
    echo "Repair completed. You may need to manually check the database state."
  else
    echo "Production environment detected. Exiting to prevent data corruption."
    exit $MIGRATION_EXIT_CODE
  fi
fi

# Start the Spring Boot application
echo "Starting Spring Boot application..."
exec java -jar app.jar
