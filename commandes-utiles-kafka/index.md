# Commandes utiles Kafka

- Canonical URL: https://leandeep.com/commandes-utiles-kafka/
- Author: Olivier Eeckhoutte
- Published: 2019-08-18T17:53:00Z
- Updated: 2019-08-18T17:53:00Z
- Language: fr
- Tags: Kafka
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici une liste de commandes utiles pour utiliser Kafka. 
Il y a pas mal de jargon dans Kafka, je vous renvoie [à l'article suivant](https://blog.univalence.io/kafka-et-les-groupes-de-consommateurs/) qui explique pas mal de choses.

<br/>

Lister les groupes de consommateurs (Consumer Groups):
```
docker run wurstmeister/kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092 --list
```

Décrire/ Obtenir des informations sur un Consumer Group:
```
docker run wurstmeister/kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092 --group id1 --describe
```

Créer un topic:
```
docker exec -it wurstmeister/kafka sh -c "JMX_PORT=10001 /opt/kafka/bin/kafka-topics.sh --create --topic topic --replication-factor 1 --partitions 1 --zookeeper zookeeper:2181"
```

Envoyer des messages:
```
docker exec -it wurstmeister/kafka sh -c "JMX_PORT=10001 /opt/kafka/bin/kafka-verifiable-producer.sh --topic topic --max-messages 200000 --broker-list localhost:9092"
```

Consumer en mode console:
```
docker exec -it wurstmeister/kafka sh -c "JMX_PORT=10001 /opt/kafka/bin/kafka-console-consumer.sh --topic topic --bootstrap-server host:9092"

docker run -it wurstmeister/kafka -c "JMX_PORT=10001 /opt/kafka/bin/kafka-console-consumer.sh --topic topic --bootstrap-server host:9092"

docker run --entrypoint=/opt/kafka/bin/kafka-console-consumer.sh wurstmeister/kafka --topic topic --bootstrap-server host:9092
```

Consumer en Python:
```
#!/usr/bin/env python
from kafka import KafkaConsumer
consumer = KafkaConsumer(bootstrap_servers='kafka1:9092',
                         group_id=None,
                         auto_offset_reset='earliest')

consumer.subscribe(['logs-app1'])
for msg in consumer:
    print(msg)

```
 
Consumer Kafkacat:
```
docker run -it confluentinc/cp-kafkacat kafkacat -b host:9092 -t topic -o beginning -v
```

Mettre de la rétention sur certains topics:
```
docker exec -it kafka /opt/kafka/bin/kafka-configs.sh --zookeeper host:2181 --entity-type topics --entity-name topic --describe

docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --zookeeper host:2181 --topic topic --describe

docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --zookeeper host:2181 --topic topic --alter --config retention.ms=1000
```

[L'article suivant](https://medium.com/walmartlabs/rendezvous-with-kafka-a-simple-guide-to-get-started-48db3b921cc) parle des partitions et des offsets: 


> In short:
When you commit an offset, it means that you read all the previous messages. So committing 7 means that next you won't read 6 and 5 but the new incoming message 8 sent by the producer.

Offset au début:
```
docker run wurstmeister/kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092 --topic topic --group id1 --reset-offsets --to-earliest --execute
```

Offset à la fin:
```
docker run wurstmeister/kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092 --topic topic --group id1 --reset-offsets --to-latest --execute
```

Offset à un moment précis:
```
docker run wurstmeister/kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092 --topic topic --group id1 --reset-offsets --to-datetime "2017-12-22T00:00:00.000" --execute
```

Offset à un moment précis pour les partitions 0, 1 (même datetime pour les 2 partitions)
```
docker run wurstmeister/kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server kafka:9092 --topic topic:0,1 --group id1 --reset-offsets --to-datetime "2017-12-22T00:00:00.000" --execute
```

Offset à un moment précis pour les partitions 0, 1 (datetimes différents):
```
docker run dddpaul/kafka-rewind --servers=kafka:9092 --group-id=id1 --topic=topic -o 0=2017-12-01 -o 1=2018-01-01
```


