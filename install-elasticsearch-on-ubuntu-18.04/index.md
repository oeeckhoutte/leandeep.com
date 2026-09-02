# Install Elasticsearch on Ubuntu 18.04 

- Canonical URL: https://leandeep.com/install-elasticsearch-on-ubuntu-18.04/
- Author: Olivier Eeckhoutte
- Published: 2019-07-06T11:01:00Z
- Updated: 2019-07-06T11:01:00Z
- Language: fr
- Tags: ElasticSearch, Ubuntu
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this article we are going to see how to install ElasticSearch as service on Ubuntu 18.04.

<br/>

## Pré-requis

Verify Java is installed:
```
$ java -version
openjdk version "11.0.3" 2019-04-16
OpenJDK Runtime Environment (build 11.0.3+7-Ubuntu-1ubuntu218.04.1)
OpenJDK 64-Bit Server VM (build 11.0.3+7-Ubuntu-1ubuntu218.04.1, mixed mode, sharing)
```

Also verify the environment variable `JAVA_HOME` is set.
```
echo $JAVA_HOME
```

If the previous command return an empty string you need to set the environment variable in your `~/.zshrc`. Add this line: `export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64`.

> Please note that it might not be this path `/usr/lib/jvm/java-11-openjdk-amd64` in your case. Just check what java path you have under `/usr/lib/jvm`.

<br/>

## Install Elasticsearch

```
sudo apt-get install apt-transport-https
# Add gpg key
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
# Add ES repo
add-apt-repository "deb https://artifacts.elastic.co/packages/7.x/apt stable main"
sudo apt-get update
# Install ES
sudo apt-get install elasticsearch
```

<br/>

## Add Servicce

```
sudo systemctl enable elasticsearch.service
sudo systemctl start elasticsearch.service
# To debug
sudo systemctl status elasticsearch.service
# or 
journalctl -xe
```

<br/>

## Verify it is working

```
curl -X GET http://localhost:9200
```

> To customize ES settings you can edit the well documented configuration file located in this path `/etc/elasticsearch/elasticsearch.yml`.


