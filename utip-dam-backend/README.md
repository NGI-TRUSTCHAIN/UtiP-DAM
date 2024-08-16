# UtiP-DAM

Tomcat 10, Spring Boot 3, Java 17, MySQL 8

Database: utip_dam.sql

Config file: mobility-app.properties

## Installation

```bash
mvn clean install
mvn package
```

target -> Mobility.war

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