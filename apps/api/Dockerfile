FROM eclipse-temurin:17-jdk-jammy

WORKDIR /opt/app

# The build context is the monorepo root. All paths are relative to that root.

# Copy the Maven wrapper and project files
COPY apps/api/mvnw .
COPY apps/api/.mvn ./.mvn
COPY apps/api/pom.xml .
COPY apps/api/src ./src

# Copy the pre-built application JAR. The CI pipeline builds this before running docker build.
COPY apps/api/target/*.jar app.jar

# Copy the entrypoint script and make it executable
COPY apps/api/entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 8080

# Add health check for container orchestration platforms
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the entrypoint script on container start
ENTRYPOINT ["./entrypoint.sh"]