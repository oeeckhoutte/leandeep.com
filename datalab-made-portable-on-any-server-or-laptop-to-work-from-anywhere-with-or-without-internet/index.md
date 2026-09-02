# Datalab made portable on any server or laptop to work from anywhere with or without internet

- Canonical URL: https://leandeep.com/datalab-made-portable-on-any-server-or-laptop-to-work-from-anywhere-with-or-without-internet/
- Author: Olivier Eeckhoutte
- Published: 2018-08-31T10:46:30Z
- Updated: 2018-08-31T10:46:30Z
- Language: fr
- Tags: Machine Learning, Docker
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Introduction
Cet article n'est pas vraiment détaillé et structuré. Il s'agit plus de notes personnelles pour avoir toujours à disposition mon datalab avec toutes les données (max 1 To for now) nécessaires pour travailler. Il s'agit d'une installation très rapide à usage personnel. Ici je ne parle pas du tout d'industrialisation ou de setup pour une grande entreprise... L'idée ici est de pouvoir travailler de partout que ce soit avec ou sans internet.


## Etapes pour reproduire la config

* Installer les drivers Cuda pour pouvoir utiliser le GPU.

* Builder l'image kaggle/python en local pour que tensorflow-gpu puisse fonctionner

* Ouvrir le firewall sur 443 pour let's encrypt et exposition de Jupyter Notebook

* Monter automatiquement les disques (voir mon tip sur le sujet): https://leandeep.com/monter-automatiquement-les-disques-au-demarrage-du-systeme/

* Créer script de démarrage simple (exemple: launch_datalab.sh)

```
cd ~/hdd2_mount
docker run -v $PWD:/tmp/working -w=/tmp/working -p 8888:8888 --rm -itd kaggle/python jupyter notebook --allow-root --ip="0.0.0.0" --notebook-dir=/tmp/working --NotebookApp.trust_xheaders='True' --NotebookApp.allow_origin='*'  --NotebookApp.token='' --NotebookApp.password=''
cd ~/Dev/jupyter-reverse-proxy
caddy &
```

* Pour le password ci-dessus utiliser Jupyter directement:
```
In [1]: from IPython.lib import passwd
In [2]: passwd()
Enter password:
Verify password:
Out[2]: 'sha1:67c9e60bb8b6:9ffede0825894254b2e042ea597d771089e11aed'
```

* Changer les droits sur le script `chmod +x`
 
* Ajouter une entrée dans crontab -e pour que le script soit lancé au boot de la machine 
`@reboot /Home/olivier/Dev/launch_datalab.sh`

* Installer Caddy (https://caddyserver.com/) dans `/usr/bin/`

* Créer un caddyfile
```
<site-datalab-masqué>   # Your site's address

ext .html   # Clean URLs
errors error.log {       # Error log
    404 error-404.html   # Custom error page
}

# API load balancer
proxy / <hostname-masqué>:<port-masqué> {
    websocket
}
```

* Faire en sorte que Caddy puisse établir une connexion sur le port 443 lorsqu'il n'est pas lancé en mode sudo `sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/caddy`

* Changer les droits `chmod` du certificat SSL pour que ce puisse être exécuté par utilisateur qui boot la machine. Le répertoire sera fournit par Caddy directement

* Synchro automatique des répertoires du disque interne vers disque externe en USB-C

