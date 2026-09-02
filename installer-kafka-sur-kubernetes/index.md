# Installer Kafka sur Kubernetes

- Canonical URL: https://leandeep.com/installer-kafka-sur-kubernetes/
- Author: Olivier Eeckhoutte
- Published: 2023-04-03T22:13:00Z
- Updated: 2023-04-03T22:13:00Z
- Language: fr
- Tags: Docker, Kubernetes, Kafka
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article très rapide, nous allons voir comment installer Kafka (et Zookeeper) sur Kubernetes (ou avoir une version pour développer en local)

<br/>

## Installation de l'opérateur Strimzi

```
kubectl create namespace kafka
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
kubectl get pod -n kafka --watch
kubectl logs deployment/strimzi-cluster-operator -n kafka -f
```

<br/>

## Création du cluster

```
kubectl apply -f https://strimzi.io/examples/latest/kafka/kafka-persistent-single.yaml -n kafka
kubectl wait kafka/my-cluster --for=condition=Ready --timeout=300s -n kafka
```

<br/>

## Envoyer et recevoir des messages

```
# Envoyer
kubectl -n kafka run kafka-producer -ti --image=quay.io/strimzi/kafka:0.34.0-kafka-3.4.0 --rm=true --restart=Never -- bin/kafka-console-producer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic my-topic

# Recevoir
kubectl -n kafka run kafka-consumer -ti --image=quay.io/strimzi/kafka:0.34.0-kafka-3.4.0 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic my-topic --from-beginning
```

<br/>

## Effacer le cluster

```
kubectl -n kafka delete $(kubectl get strimzi -o name -n kafka)
```

<br/>

## Effacer l'opérateur

```
kubectl -n kafka delete -f 'https://strimzi.io/install/latest?namespace=kafka'
```

<br/>

## Autres

### Tip 1
Dans le cas ou vous souhaitez récupérer des YAML distants en local (pour les backuper dans git par exemple) et les appliquer ensuite, on peut aussi utiliser la commande suivante:

```
cat <<EOF | kubectl create -n kafka -f -
apiVersion: kafka.strimzi.io/v1beta2
...
EOF
```

<br/>

### Tip 2

Sinon en local, il y a toujours l'option `docker-compose` qui est simple et efficace...

```
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    restart: always
    ports:
      - 22181:2181

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    restart: always
    ports:
      - 29092:29092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

```
