# Démarrer simplement des services systemd sur Docker et Centos 7

- Canonical URL: https://leandeep.com/d%C3%A9marrer-simplement-des-services-systemd-sur-docker-et-centos-7/
- Author: Lean Deep
- Published: 2019-09-15T19:33:17Z
- Updated: 2019-09-15T19:33:17Z
- Language: fr
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Cet article rapide explique comment faire un *workaround* lorsqu'on essaye de faire un `systemctl status un_service` dans un container Docker sur Centos (ou Ubuntu) avec Docker 19.03. Sans ce *workaround* on obtient l'erreur suivante `Failed to get D-Bus connection: Operation not permitted`.


Créer une image docker basée sur Centos 7:

```
# This shows systemd services (nginx and named) running in a centos7 container.
# There have been lots of problems and workarounds for this, see:
# https://hub.docker.com/_/centos/
# https://github.com/docker/docker/issues/7459

FROM centos:centos7

RUN yum install -y epel-release # for nginx
RUN yum install -y initscripts  # for old "service"

ENV container=docker

RUN (cd /lib/systemd/system/sysinit.target.wants/; for i in *; do [ $i == systemd-tmpfiles-setup.service ] || rm -f $i; done); \
rm -f /lib/systemd/system/multi-user.target.wants/*;\
rm -f /etc/systemd/system/*.wants/*;\
rm -f /lib/systemd/system/local-fs.target.wants/*; \
rm -f /lib/systemd/system/sockets.target.wants/*udev*; \
rm -f /lib/systemd/system/sockets.target.wants/*initctl*; \
rm -f /lib/systemd/system/basic.target.wants/*;\
rm -f /lib/systemd/system/anaconda.target.wants/*;

# named (dns server) service
RUN yum install -y bind bind-utils
RUN systemctl enable named.service 

# Unrelated to systemd, but Apacehe httpd install fails at least if docker uses
# (default) aufs.
#   Error unpacking rpm package httpd-2.4.6-40.el7.centos.x86_64
#   error: unpacking of archive failed on file /usr/sbin/suexec: cpio: cap_set_file
#RUN yum install -y httpd

# webserver service
RUN yum install -y nginx
RUN systemctl enable nginx.service

# Without this, init won't start the enabled services and exec'ing and starting
# them reports "Failed to get D-Bus connection: Operation not permitted".
VOLUME /run /tmp

# Don't know if it's possible to run services without starting this
CMD /usr/sbin/init
```

Maintenant on crée un docker-compose.yml:

```
version: '3'
services:
  test:
    build:
      context: .
    cap_add:
      - SYS_ADMIN
    security_opt:
      - seccomp:unconfined
    volumes:
      - /sys/fs/cgroup:/sys/fs/cgroup:ro
    ports:
      - "80:80"
      # The DNS server works within container (dig @localhost example.com), but
      # *not* via published port. Not sure this is related to systemd.
      #- "53:53/tcp"
      #- "53:53/udp"
      
```

Et voilà. Buildez et démarrez votre container :

```
docker-compose build && docker-compose down && docker-compose up -d
```

Connectez vous à votre container et essayez de voir le status d'un service:

```
docker ps # pour récupérer son id
# Puis 
docker exec -it ID_DU_CONTAINER /bin/bash
systemctl status nginx
```

Cela va fonctionner ;) ... 


