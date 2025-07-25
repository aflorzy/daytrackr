#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Note about Flyway: Not currently implemented but planned for future
# Uncomment the following once Flyway is set up
# echo "Running Flyway migrations..."
# ./mvnw flyway:migrate -Dflyway.url="$SPRING_DATASOURCE_URL" -Dflyway.user="$SPRING_DATASOURCE_USERNAME" -Dflyway.password="$SPRING_DATASOURCE_PASSWORD"
# echo "Flyway migrations completed."

# Set default profile to 'dev' if not provided
if [ -z "$SPRING_PROFILES_ACTIVE" ]; then
  export SPRING_PROFILES_ACTIVE=dev
  echo "No profile specified. Using default profile: $SPRING_PROFILES_ACTIVE"
else
  echo "Using profile: $SPRING_PROFILES_ACTIVE"
fi

# Start the Spring Boot application
echo "Starting Spring Boot application..."
exec java -jar app.jar
