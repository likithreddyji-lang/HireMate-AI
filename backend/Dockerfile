# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build the JAR with Maven
# ─────────────────────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom first for layer caching — dependencies won't re-download unless pom changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build (skip tests for faster builds on Render)
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Minimal runtime image
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S hiremate && adduser -S hiremate -G hiremate
USER hiremate

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render sets PORT env var automatically; Spring Boot reads server.port
EXPOSE 8080

# Health check so Render knows when the service is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-8080}/api/auth/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
