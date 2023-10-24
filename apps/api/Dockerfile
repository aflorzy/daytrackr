FROM maven:3.8.3-openjdk-17 as build
WORKDIR /app

COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM maven:3.8.3-openjdk-17
WORKDIR /app

# Copy the JAR file from the build stage to the runtime image
COPY --from=build /app/target/daytrackr*.jar ./app.jar

# Expose the port your Spring Boot application is listening on
EXPOSE 8082

# Command to run the Spring Boot application
CMD ["java", "-jar", "app.jar"]

