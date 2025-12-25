# -------- Build stage --------
FROM gradle:8.7-jdk17 AS build
WORKDIR /app

# Copiamos todo el backend al contenedor
COPY . .

# Construye el jar (saltando tests para evitar fallos por entorno)
RUN gradle bootJar --no-daemon -x test

# -------- Run stage --------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copia el jar generado
COPY --from=build /app/build/libs/*.jar app.jar

# Render usará PORT, pero Spring ya lo lee desde application.yml
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
