# UtiP-DAM

Tomcat 10, Spring Boot 3, Java 17, MySQL 8

Database: utip_dam.sql

Config file: /opt/mobility-app.properties

Other tools: 

/opt/utils/anonymization-v1.4.py

/opt/utils/audit-v1.2.py

## Installation

```bash
mvn clean install
mvn package
```

Output -> mobility.war

Reverse proxy mapping (Nginx)

```bash
location /api/ {
    ...
    proxy_pass http://localhost:8081/mobility/;
}
```

## Usage

1. anonymize

```bash
curl -D headers.txt -X POST "https://ngi.cs.co.il/api/mobility/anonymize" --form file=@test.csv --form k=2
```

2. audit

```bash
curl -X POST "https://ngi.cs.co.il/api/mobility/audit" --form file=@test.csv --form k=2
```

3. device to visitor id

```bash
curl -X GET "https://ngi.cs.co.il/api/deviceToVisitorId?sensorId=3281&mac=4C:75:25:97:D1:FD"
```