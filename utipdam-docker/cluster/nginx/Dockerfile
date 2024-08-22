FROM nginx:stable-alpine


COPY default.conf /etc/nginx/conf.d/default.conf
COPY utip-dam-v1.2.3.tar.gz /srv/web/utip-dam-v1.2.3.tar.gz

RUN mkdir /srv/web/utip-dam
RUN tar -xzf /srv/web/utip-dam-v1.2.3.tar.gz -C /srv/web/utip-dam
