# Keycloak installation using Docker

- Canonical URL: https://leandeep.com/keycloak-installation-using-docker/
- Author: Olivier Eeckhoutte
- Published: 2023-03-14T19:49:00+02:00
- Updated: 2023-03-14T19:49:00+02:00
- Language: fr
- Tags: Keyclaok, IAM, User Federation
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

The purpose of the short article is the describe the commands to launch a Keycloak instance on your local dev environment.
For production purpose I would suggest a Kubernetes deployment.


## Option 1 (without docker-compose)

**Create Docker Network**

```
docker network create keycloak-network
```

<br/>

**Launch Postgres DB**

```
export POSTGRES_KEYCLOAK_PWD=""
docker run --name postgres --net keycloak-network -e POSTGRES_DB=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=$POSTGRES_KEYCLOAK_PWD -p 5432:5432 postgres
```

<br/>

**Launch Keyclaok instance and pass it Postgres environment variables**

```
docker run --name keycloak --net keycloak-network -p 8080:8080 -e DB_ADDR=postgres -e DB_USER=keycloak -e DB_PASSWORD=$POSTGRES_KEYCLOAK_PWD jboss/keycloak:16.1.1
```

<br/>
**Create a Keycloak admin user**

```
# Get the Keycloak container id
docker ps
export CONTAINER_ID=...
docker exec -it $CONTAINER_ID bash
cd /opt/jboss/keycloak/bin/
./add-user.sh -u your_username -p your_password --silent
./add-user-keycloak.sh -u your_username -p your_password
exit
docker restart $CONTAINER_ID
```

Now you can go to http://localhost:8080 and connect using the admin account you just created.

<br/>

## Option 2 (with docker-compose way easier)

Simply create a file called `docker-compose.yml` and add the following content:

```
version: '3'

volumes:
  postgres_data:
      driver: local

services:
  postgres:
      image: postgres
      volumes:
        - postgres_data:/var/lib/postgresql/data
      environment:
        POSTGRES_DB: keycloak
        POSTGRES_USER: keycloak
        POSTGRES_PASSWORD: password
      ports:
        - 5432:5432
  keycloak:
      image: jboss/keycloak:16.1.1
      environment:
        DB_VENDOR: POSTGRES
        DB_ADDR: postgres
        DB_DATABASE: keycloak
        DB_USER: keycloak
        DB_SCHEMA: public
        DB_PASSWORD: password
        KEYCLOAK_USER: admin
        KEYCLOAK_PASSWORD: Pa55w0rd
        # Uncomment the line below if you want to specify JDBC parameters. The parameter below is just an example, and it shouldn't be used in production without knowledge. It is highly recommended that you read the PostgreSQL JDBC driver documentation in order to use it.
        #JDBC_PARAMS: "ssl=true"
      ports:
        - 8080:8080
      depends_on:
        - postgres

```

And then simply execute `docker-compose up`


<br/>

## Run Keycloak on Apple M1/M2 processors

Si vous voulez faire tourner Keycloak, dans sa version actuelle `16.1.1`, sur un Mac équipé d'un processeur M1/M2, alors vous devez le builder vous-même sur votre Mac.
```
export VERSION=16.1.1

cd /tmp
git clone git@github.com:keycloak/keycloak-containers.git
cd keycloak-containers/server
git checkout $VERSION
docker build -t "jboss/keycloak:${VERSION}" .

# docker build -t "quay.io/keycloak/keycloak:${VERSION}" .
```

