# Installer InfluxDB 2 sur Debian 11

- Canonical URL: https://leandeep.com/installer-influxdb-2-sur-debian-11/
- Author: Olivier Eeckhoutte
- Published: 2023-01-27T09:49:00+02:00
- Updated: 2023-01-27T09:49:00+02:00
- Language: fr
- Tags: InfluxDB, Timeseries
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article très court, nous allons voir comment installer InfluxDB 2 via Docker sur Debian 11.

<br/>

## Installation de Docker

```
apt install docker.io

curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose
```

<br/>

On active ensuite le service:

```
systemctl enable docker
systemctl start docker
```

<br/>

## Installation d'InfluxDB


Une fois Docker et docker-compose installés, on peut créer nos fichiers `docker-compose.yml`, `influx.env` et `telegraf.conf`.

Contenu du fichier `docker-compose.yml`:
```
version: '3'

services:
  influxdb:
    image: influxdb:2.6-alpine
    restart: always
    env_file:
      - influxv2.env
    volumes:
      # Mount for influxdb data directory and configuration
      - influxdbv2:/var/lib/influxdb2:rw
    ports:
      - "8086:8086"
  telegraf:
    image: telegraf:1.25-alpine
    restart: always
    depends_on:
      - influxdb
    volumes:
      # Mount for telegraf config
      - ./telegraf.conf:/etc/telegraf/telegraf.conf:ro
    env_file:
      - influxv2.env

volumes:
  influxdbv2:

```

<br/>

Contenu du fichier `telegraf.conf`:
```
# Configuration for telegraf agent
[agent]
  ## Default data collection interval for all inputs
  interval = "10s"
  ## Rounds collection interval to 'interval'
  ## ie, if interval="10s" then always collect on :00, :10, :20, etc.
  round_interval = true

  ## Telegraf will send metrics to outputs in batches of at most
  ## metric_batch_size metrics.
  ## This controls the size of writes that Telegraf sends to output plugins.
  metric_batch_size = 1000

  ## For failed writes, telegraf will cache metric_buffer_limit metrics for each
  ## output, and will flush this buffer on a successful write. Oldest metrics
  ## are dropped first when this buffer fills.
  ## This buffer only fills when writes fail to output plugin(s).
  metric_buffer_limit = 10000

  ## Collection jitter is used to jitter the collection by a random amount.
  ## Each plugin will sleep for a random time within jitter before collecting.
  ## This can be used to avoid many plugins querying things like sysfs at the
  ## same time, which can have a measurable effect on the system.
  collection_jitter = "0s"

  ## Default flushing interval for all outputs. Maximum flush_interval will be
  ## flush_interval + flush_jitter
  flush_interval = "10s"
  ## Jitter the flush interval by a random amount. This is primarily to avoid
  ## large write spikes for users running a large number of telegraf instances.
  ## ie, a jitter of 5s and interval 10s means flushes will happen every 10-15s
  flush_jitter = "0s"

  ## By default or when set to "0s", precision will be set to the same
  ## timestamp order as the collection interval, with the maximum being 1s.
  ##   ie, when interval = "10s", precision will be "1s"
  ##       when interval = "250ms", precision will be "1ms"
  ## Precision will NOT be used for service inputs. It is up to each individual
  ## service input to set the timestamp at the appropriate precision.
  ## Valid time units are "ns", "us" (or "µs"), "ms", "s".
  precision = ""

  ## Logging configuration:
  ## Run telegraf with debug log messages.
  debug = false
  ## Run telegraf in quiet mode (error log messages only).
  quiet = false
  ## Specify the log file name. The empty string means to log to stderr.
  logfile = ""

  ## Override default hostname, if empty use os.Hostname()
  hostname = ""
  ## If set to true, do no set the "host" tag in the telegraf agent.
  omit_hostname = false
[[outputs.influxdb_v2]]	
  ## The URLs of the InfluxDB cluster nodes.
  ##
  ## Multiple URLs can be specified for a single cluster, only ONE of the
  ## urls will be written to each interval.
  ## urls exp: http://127.0.0.1:8086
  urls = ["http://influxdb:8086"]

  ## Token for authentication.
  token = "${DOCKER_INFLUXDB_INIT_ADMIN_TOKEN}"
  
  ## Organization is the name of the organization you wish to write to; must exist.
  organization = "${DOCKER_INFLUXDB_INIT_ORG}"
  
  ## Destination bucket to write into.
  bucket = "${DOCKER_INFLUXDB_INIT_BUCKET}"

  insecure_skip_verify = true

[[inputs.cpu]]
  ## Whether to report per-cpu stats or not
  percpu = true
  ## Whether to report total system cpu stats or not
  totalcpu = true
  ## If true, collect raw CPU time metrics.
  collect_cpu_time = false
  ## If true, compute and report the sum of all non-idle CPU states.
  report_active = false
[[inputs.disk]]
  ## By default stats will be gathered for all mount points.
  ## Set mount_points will restrict the stats to only the specified mount points.
  # mount_points = ["/"]
  ## Ignore mount points by filesystem type.
  ignore_fs = ["tmpfs", "devtmpfs", "devfs", "overlay", "aufs", "squashfs"]
[[inputs.diskio]]
[[inputs.mem]]
[[inputs.net]]
[[inputs.processes]]
[[inputs.swap]]
[[inputs.system]]

```


<br/>

Contenu du fichier `influx.env`:

```
DOCKER_INFLUXDB_INIT_MODE=setup
DOCKER_INFLUXDB_INIT_USERNAME=mon_user_secured
DOCKER_INFLUXDB_INIT_PASSWORD=mon_super_password
DOCKER_INFLUXDB_INIT_ORG=70c
DOCKER_INFLUXDB_INIT_BUCKET=cex
DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=mon_token_de_fou
```


<br/>

Et voilà, il ne reste plus qu'à exécuter cette commande:
```
docker-compose up -d
```

> Bien sûr, même si le docker-compose contient la propriété `restart: always` permettant de démarrer les containers Docker même après un restart de Docker ou reboot de votre machine, je ne recommande pas cette config pour de la prod.
 
