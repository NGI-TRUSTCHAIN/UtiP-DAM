# UtiP-DAM

Tomcat 10, Spring Boot 3, Java 17, MySQL 8

Backend services for Mobility

*anonymize*

curl -D headers.txt -X POST "https://ngi.cs.co.il/api/mobility/anonymize" --form file=@test.csv --form k=2

*audit*

curl -X POST "https://ngi.cs.co.il/api/mobility/audit" --form file=@test.csv --form k=2

*device to visitor id*

curl -X GET "https://ngi.cs.co.il/api/deviceToVisitorId?sensorId=3281&mac=4C:75:25:97:D1:FD"
