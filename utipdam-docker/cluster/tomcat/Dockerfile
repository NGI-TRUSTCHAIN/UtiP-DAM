FROM tomcat:10-jdk17


COPY mobility-app.properties /opt/mobility-app.properties
COPY anonymization-v1.4.py /opt/utils/anonymization-v1.4.py
COPY audit-v1.2.py /opt/utils/audit-v1.2.py
COPY ./webapps/mobility.war /usr/local/tomcat/webapps/mobility.war

RUN apt-get update && apt-get install python3-pip -y
RUN apt-get install python3-pandas -y
