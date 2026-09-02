# Monter un dossier distant avec SSHFS

- Canonical URL: https://leandeep.com/monter-un-dossier-distant-avec-sshfs/
- Author: Olivier Eeckhoutte
- Published: 2018-12-29T21:24:00Z
- Updated: 2018-12-29T21:24:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## (Classique) Monter un disque remote en local

`SSHFS` sert à monter sur son système de fichier, un autre système de fichier distant, à travers une connexion SSH, le tout avec des droits utilisateur.

C'est plutôt pratique. Voici la commande:

```
sshfs -p <votre_port_ssh> -o allow_other,defer_permissions olivier@ip_server:path_dossier_a_monter repertoire_en_local
```

> Installer sshfs sur Ubuntu: `sudo apt install -y sshfs`

> Installer sshfs sur OSX: `brew cask install osxfuse && brew install sshfs`

<br/>

## (L'inverse, plus cool) Monter un disque local sur un serveur remote

```
export REMOTE_USER=root
export IP_REMOTE_SERVEUR=vps
export LOCAL_USER=olivier
export REMOTE_BASE_PATH=/root # pas très secure mais j'utilise une trash machine

# Pré-requis:
# Le répertoire $REMOTE_BASE_PATH/disk_remote doit exister sur le serveur distant

# Lancé depuis un MAC vers serveur Linux
mkdir -p /Users/$LOCAL_USER/shared_data
ssh -t -p 22 $REMOTE_USER@$IP_REMOTE_SERVEUR -R 10000:localhost:22 "sshfs -o NoHostAuthenticationForLocalhost=yes,reconnect,allow_other,nonempty -p 10000 $LOCAL_USER@localhost:/Users/$LOCAL_USER/shared_data $REMOTE_BASE_PATH/disk_remote;bash"

# Lancé depuis un serveur linux vers un autre serveur linux (en mode background)
# autossh -M 0 -f -t -p 22 $REMOTE_USER@$IP_REMOTE_SERVEUR -R 10000:localhost:22 "sshfs -o NoHostAuthenticationForLocalhost=yes,allow_other,nonempty,reconnect -p 10000 $LOCAL_USER@localhost:/home/$LOCAL_USER/shared_data $REMOTE_BASE_PATH/disk_remote"

# Example:
# ssh -t -p 22 root@vps -R 10000:localhost:22 "sshfs -o allow_other,cache=no,no_readahead,no_remote_lock,compression=no,uid=1000,gid=1000,NoHostAuthenticationForLocalhost=yes,reconnect -p 10000 olivier@localhost:/Users/olivier/shared_data /root/disk_remote;bash"

# Checker si le disque local a bien été monté
# Normalement vous devriez être connecté à votre serveur distant après l'exécution de la commande précédente
mount
touch toto

# disconnect 
umount -f $LOCAL_USER@localhost:/home/$LOCAL_USER/shared_data
ls
```


