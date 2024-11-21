# Use a base image with JDK 22
FROM eclipse-temurin:22-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the Spring Boot jar file into the container
COPY target/koi-delivery-ordering-system-0.0.1-SNAPSHOT.jar app.jar

# Expose the port Spring Boot runs on (change it if necessary)
EXPOSE 8080

# Command to run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
