# -------- Build stage --------
FROM gradle:8.14.3-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon -x test

# -------- Run stage --------
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
