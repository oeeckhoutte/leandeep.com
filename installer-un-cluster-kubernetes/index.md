# Installer un cluster Kubernetes

- Canonical URL: https://leandeep.com/installer-un-cluster-kubernetes/
- Author: Olivier Eeckhoutte
- Published: 2018-07-17T21:02:00Z
- Updated: 2018-07-17T21:02:00Z
- Language: fr
- Tags: Cloud
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Pour de la Production

Il suffit d'utiliser Rancher 2. Pour cela, il suffit d'utiliser ce container Docker:

```
sudo docker run -d --restart=unless-stopped -p 80:80 -p 443:443 rancher/rancher
```

C'est tout ! Il suffit de suivre les instructions...

> Note: Use absolutely a supported Docker version

```
To install specific Docker version: (see README: https://github.com/rancher/rancher)

Go to https://download.docker.com/linux/static/stable/ 

Extract the archive using the tar utility. The dockerd and docker binaries are extracted.

$ tar xzvf /path/to/<FILE>.tar.gz
Optional: Move the binaries to a directory on your executable path, such as /usr/bin/. If you skip this step, you must provide the path to the executable when you invoke docker or dockerd commands.

$ sudo cp docker/* /usr/bin/
Start the Docker daemon:

$ sudo dockerd &
If you need to start the daemon with additional options, modify the above command accordingly or create and edit the file /etc/docker/daemon.json to add the custom configuration options.

Verify that Docker is installed correctly by running the hello-world image.

$ sudo docker run hello-world
```

<br/>

## Pour du Développement (i.e. DevOps)


On installe Virtualbox:
```
sudo apt-get install -y virtualbox virtualbox-ext-pack
```

Installation de Minikube et kubectl:
```
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
chmod +x minikube
sudo mv -v minikube /usr/local/bin

curl -Lo kubectl https://storage.googleapis.com/kubernetes-release/release/v1.8.0/bin/linux/amd64/kubectl
chmod +x kubectl
sudo mv -v kubectl /usr/local/bin
```

On vérifie que cela fonctionne. On commence par démarrer minikube et on démarre un service Nginx:
```
minikube start
kubectl run dh-nginx --image=nginx --port=80
kubectl expose deployment dh-nginx --type=NodePort
```

