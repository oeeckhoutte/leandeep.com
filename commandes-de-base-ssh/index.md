# Commandes de base SSH

- Canonical URL: https://leandeep.com/commandes-de-base-ssh/
- Author: Olivier Eeckhoutte
- Published: 2011-12-10T09:49:00+02:00
- Updated: 2011-12-10T09:49:00+02:00
- Language: fr
- Tags: SSH
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Connexion

Dans un terminal, exécuter la commande suivante:
```
ssh user@host
```

> Par défaut le port 22 est utilisé

<br/>

**Se connecter sur un port particulier:**

```
ssh user@host -p port
```

<br/>

**Créer des raccourcis pour vous connecter plus facilement à différents hosts:**

Créer un fichier de config `~/.ssh/config` et gérer vos config comme ceci:
```
Host hostname1
    HostName 192.168.0.10
    User    olivier
    Port    1234

Host hostname2
    PubkeyAuthentication yes
    IdentityFile ~/.ssh/server_vps1
```

Ensuite, il vous suffit d'utiliser les commandes suivantes pour vous connecter à vos différents hosts:

```
ssh hostname1
ssh hostname2
```

<br/>

## Clé SSH

Ajouter votre clé publique sur un serveur distant:

```
ssh-keygen -t rsa
cat id_rsa.pub | ssh user@host 'cat >> .ssh/authorized_keys'
ssh user@host
```

<br/>

## Remote Commands 

Il est possible d'exécuter des commandes à distance. Par exemple:
```
ssh user@host "ls"
```

Le stdin et stdout sera local

<br/>

## Gérer plusieurs config pour le même serveur

```
Host option1.host
    HostName host
    User     user1

Host option2.host
    HostName host
    User     user2

```

Puis pour vous connecter: 

```
ssh option1.host
ssh option2.host
```

<br/>

## Configurer Github avec protocol SSH

```
Host repo1.github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/repo1_rsa

Host repo2.github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/repo2_rsa
```

Puis `git clone repo1.github.com`

<br/>

## Copier des fichier over SSH avec SCP

```
scp mon_image.png olivier@remoteserver:/media/data/mon_image.png

# ou dans l'autre sens
scp olivier@remoteserver:/media/data/mon_image.png mon_image.png

# Si votre fichier contient des espaces
file="foo bar/baz"
file=${file// /\\ }
scp vps:"$file" .
```



> Le paramètre port est `-P` et pas `-p` contrairement à `SSH`

<br/>

## Copier votre clé publique SSH sur une machine distante

```
ssh-copy-id user@remoteserver
```

<br/>

Alternative:

```
cat ~/.ssh/id_rsa.pub | ssh remoteserver 'cat >> .ssh/authorized_keys'
```

<br/>

## Exécuter une commande à distance

```
ssh remoteserver "cat /var/log/nginx/access.log" | grep "string_to_find"
```

> `| grep ...` est exécuté localement

<br/>

## Copier des fichiers à distance avec rsync

```
rsync -azcrv --progress /home/olivier/data remoteserver:backup/
```

> `-z` permet d'avoir la compression gzip <br/>
`-a` permet d'être en mode archive; ce qui revient à copier recursivement des fichiers
`-c` check checksum. Si le contenu du fichier est différent, le fichier est recopié
`-r` recursif
`-v` verbose


<br/>

## SSH sur une  instance EC2

```
chmod 400 my-ec2-ssh-key.pem
ssh -i ~/.ssh/my-ec2-key.pem ubuntu@my-ec2-public
```

<br/>

## Mount remote SSH location comme dossier local avec SSHFS

```
# apt install sshfs # sur linux
# brew install sshfs # sur OSX
mkdir /tmp/data
sshfs user@remoteserver:/media/data /tmp/data/

# Umount with: 
## On OSX
sudo diskutil umount force /tmp/data

## On Linux
killall sshfs
sudo umount -l /tmp/data
```

<br/>

## Jump box

```
ssh -J host1,host2,host3 user@host4.internal
```


