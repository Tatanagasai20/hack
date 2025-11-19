FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY target/trafficservice-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8092

ENTRYPOINT ["java", "-jar", "app.jar"]

