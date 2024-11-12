# Build stage
FROM maven:3.8.3-openjdk-17-slim AS build
WORKDIR /app

# Copy only pom.xml first to leverage Docker cache
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Create a non-root user
RUN addgroup --system javauser && adduser --system --ingroup javauser javauser

# Copy the JAR file from the build stage
COPY --from=build /app/target/daytrackr*.jar app.jar

# Set ownership of the app directory to the non-root user
RUN chown -R javauser:javauser /app

# Use the non-root user
USER javauser

# Expose the port your Spring Boot application is listening on
EXPOSE 8080

# Add labels
# LABEL maintainer="Andrew Flores andrewtflores@yahoo.com"
# LABEL version="1.0"
# LABEL description="DayTrackr Backend"

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

# Command to run the Spring Boot application
CMD ["java", "-jar", "app.jar"]