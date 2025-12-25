# -------- Build stage --------
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copiamos todo el backend
COPY . .

# Asegura permisos del wrapper (en Linux)
RUN chmod +x ./gradlew

# Construye el jar
RUN ./gradlew bootJar --no-daemon -x test

# -------- Run stage --------
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
