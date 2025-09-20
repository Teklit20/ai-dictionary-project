# Docker (to be completed in later steps)

Planned images:
- auth-service
- word-service
- ai-service
- frontend

Each service will have a Dockerfile like:
```
FROM eclipse-temurin:17-jre
COPY target/app.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```
