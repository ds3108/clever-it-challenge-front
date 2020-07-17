# Use node Image
FROM node:12.16 AS react
# Set dir and copy files
WORKDIR /frontend
COPY ./src/main/resources/frontend .
# Install modules
RUN npm install
# Build
RUN npm run build


# Use maven image
FROM maven AS spring
# Set dir and copy files
WORKDIR /app
COPY . .
# Eliminamos la carpeta de frontend
RUN rm -Rf ./src/main/resources/frontend
# Copiamos la version ya compilada de React
COPY --from=react /frontend/build /app/src/main/resources/static
# Generamos el JAR de Spring Boot
RUN mvn clean package spring-boot:repackage

# Llevamos los archivos generados a un contener limpio con java
FROM openjdk:8
# Usamos la carpeta app
WORKDIR /app
# Copiamos la version ya compilada de React
COPY --from=spring /app/target/springboottest-1.0.0-SNAPSHOT.jar .
# Ejecutamos el contenedor
CMD ["java", "-jar", "springboottest-1.0.0-SNAPSHOT.jar"]
