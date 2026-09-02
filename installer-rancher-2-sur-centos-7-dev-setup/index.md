# Installer Rancher 2 sur Centos 7 (Dev setup)

- Canonical URL: https://leandeep.com/installer-rancher-2-sur-centos-7-dev-setup/
- Author: Olivier Eeckhoutte
- Published: 2019-05-05T19:00:00Z
- Updated: 2019-05-05T19:00:00Z
- Language: fr
- Tags: Rancher 2, Kubernetes, Docker
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Please note that I do not recommend this setup for production. It is convenient for development/demo purposes.**

<br/>

## Docker installation

*Install needed packages:*

```
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

*Configure the docker-ce repo:*

```
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

*Install docker-ce:*

```
sudo yum install docker-ce
```

*Create Docker group:*
```
sudo groupadd docker
```

*It appeared that docker.sock was owned by root and in the group root:*
```
ls -l /var/run/docker.sock

srw-rw---- 1 root root 0 May 6 15:42 /var/run/docker.sock
```

*Changing the group ownership:*
```
sudo chown root:docker /var/run/docker.sock

ls -l /var/run/docker.sock

srw-rw---- 1 root docker 0 May 6 15:42 /var/run/docker.sock
```

*Add your user to the docker group with the following command.*

```
sudo usermod -aG docker $(whoami)
```

*Set Docker to start automatically at boot time:*

```
sudo systemctl enable docker.service
```

*Finally, start the Docker service:*

```
sudo systemctl start docker.service
```

*Logging back on, now can run docker commands without sudo.*

<br/>

## Docker-compose installation

*Install Extra Packages for Enterprise Linux*

```
sudo yum install epel-release
Install python-pip

sudo yum install -y python-pip
Then install Docker Compose:

sudo pip install docker-compose
```

*You will also need to upgrade your Python packages on CentOS 7 to get docker-compose to run successfully:*

```
sudo yum upgrade python*
```

*To verify a successful Docker Compose installation, run:*

```
docker-compose version
```

<br/>

## Rancher 2 installation
```
docker run -d --restart=unless-stopped \
  -p 8080:80 -p 8443:443 \
  -v /opt/rancher:/var/lib/rancher \
  rancher/rancher:latest \
  --acme-domain <DNS_GUI_RANCHER>
```

> In the situation where you want to use a single node to run Rancher and to be able to add the same node to a cluster, you have to adjust the host ports mapped for the rancher/rancher container.

> If a node is added to a cluster, it deploys the nginx ingress controller which will use port 80 and 443. This will conflict with the default ports we advise to expose for the rancher/rancher container.

