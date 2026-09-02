# Développer sur iPad

- Canonical URL: https://leandeep.com/d%C3%A9velopper-sur-ipad/
- Author: Olivier Eeckhoutte
- Published: 2022-02-12T19:02:00Z
- Updated: 2022-02-12T19:02:00Z
- Language: fr
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Je ne rentrerais pas dans les détails de ce que je pense d'Apple et ses techniques Marketing douteuses pour pousser ses clients à la (sur)consommation. Je peux néanmoins toujours pas me passer du Macbook Pro et d'un iPad pour la qualité du matériel et surtout pour OSX et son interopérabilité avec les logiciels Enterprise de l'écosystème Microsoft (Office, Teams, etc). J'aurais préféré un Linux mais on est très loin du niveau d'OSX parfaitement intégré.

L'iPhone, par contre, je le trouve beaucoup trop cher pour que c'est. Et surtout iOS est totalement (volontairement et inutilement) limité et bien en dessous d'Android en terme de fonctionnalités.

Lorsque je voyage pour le tourisme, je n'ai pas forcément envi de transporter mon précieux Macbook Pro. Transporter uniquement un iPad pourrait être une bonne solution mais il est limité. Il n'y a pas de terminal, pas d'IDE; bref pour mon travail c'est totalement limitant. Un smartphone Android est presque une meilleure alternative car son système est ouvert mais il faut transporter un clavier bluetooth, une souris, un câble HDMI et espérer qu'il y aura une télévision pas trop ancienne là où vous vous rendez. Si vous voyagez en Europe de l'Ouest cela devrait aller mais si vous partez ailleurs... Certaines personnes parlent d'IDE (github.dev) ou de VM dans le Cloud mais de la même manière, si vous partez dans un pays pauvre ou sous développé vous n'aurez pas forcément accès à la 3G/4G ou à du Wifi. 

Ma solution à ce problème consiste à utiliser la combinaison iPad + Logitech Folio Touch + mon Smartphone Android. Je me sers de l'iPad comme écran principalement, du clavier/ trackpad pour coder et je le connecte en remote à mon Smartphone Android (un Linux). Depuis mon Smartphone, je crée un hotspot et j'installe un Ubuntu + Code server et je connecte mon iPad dessus. Avec cette solution, je n'ai pas besoin d'internet et je peux avoir tous les outils que je souhaite sans limitation.

<br/>

# Installation

Sur Android, installer Userland et télécharger un Ubuntu. 

Démarrer ensuite un hotspot et connectez y votre iPad en wifi.

Sur l'Ubuntu nouvellement démarré sur Android, exécuter les commandes suivantes:

```
sudo apt update
sudo apt upgrade -y
sudo apt install vim git wget net-tools tmux -y
# Récupérer l'adresse IP de votre smartphone
ifconfig 
wget https://bit.ly/3CveNfu -O vscode.tar.gz
#wget https://github.com/cdr/code-server/releases/download/v3.12.0/code-server-3.12.0-linux-arm64.tar.gz
tar -zxvf ./vscode.tar.gz
#tar -xvf ./code-server-3.12.0-linux-arm64.tar.gz
cd code-server-*/bin
export PASSWORD="password"
./code-server
ctrl+c
```
Editer le fichier `~/.config/code-server/config.yaml` et spécifier `0.0.0.0` comme bind address à la place de `127.0.0.1`. 

<br/>
Pour avoir de l'HTTPS sur votre instance code-server, exécutez les commandes suivantes:

```
# Replaces "cert: false" with "cert: true" in the code-server config.
sed -i.bak 's/cert: false/cert: true/' ~/.config/code-server/config.yaml
# Replaces "bind-addr: 0.0.0.0:8080" with "bind-addr: 0.0.0.0:443" in the code-server config.
sed -i.bak 's/bind-addr: 0.0.0.0:8080/bind-addr: 0.0.0.0:443/' ~/.config/code-server/config.yaml
# Allows code-server to listen on port 443.
sudo apt install -y libcap2-bin
sudo setcap cap_net_bind_service=+ep /home/olivier/code-server-3.10.2-linux-arm64/lib/node
./code-server
```

Relancer ensuite code-server puis rendez-vous sur [https://192.168.43.1:2443/](https://192.168.43.1:2443/)

<br/>

## Test

Sur votre iPad, ouvrez une nouvelle fenêtre Safari et rendez-vous à l'adresse sur laquelle tourne code-server. Pour ma part, il s'agit de l'adresse [http://10.157.254.22:8080](https://10.157.254.22:8080).

Pour accéder au terminal de votre Ubuntu installé sur votre smartphone depuis votre iPad, installez l'app WebSSH. Le port SSH d'Ubuntu sur Userland est le `2022`.

> Ou depuis un Mac: ssh userland@192.168.43.1 -p 2022

> Installer une app de type [Keep Screen On](https://play.google.com/store/apps/details?id=in.snapcore.screen_alive) sur votre Android pour éviter que UserLand ne se stoppe.

<br/>

## Création d'un service

> systemd error: `System has not been booted with systemd as init system (PID 1). Can't operate.
Failed to connect to bus: Host is down`

Systemd n'est pas accessible donc créer un fichier dans `/etc/init.d/code`:

```
#!/bin/sh
### BEGIN INIT INFO
# Provides:          code-server
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: code-server
# Description:       Init script for coder-server. Edit
#                    ~/.config/code-server/config.yaml to configure the server.

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/home/olivier/coder/bin/code-server
NAME=code-server
DESC="Code-server app"

NO_START=0

set -e

. /lib/lsb/init-functions

cancel() { echo "$1" >&2; exit 0; };
test -x "$DAEMON" || cancel "$DAEMON does not exist or is not executable."
test ! -x /usr/sbin/update-service || ! update-service --check code-server ||
  cancel 'The code-server service is controlled through runit, use the sv(8) program'

case "$1" in
  start)
	test "$NO_START" = "0" || cancel "Starting $DESC: [abort] NO_START is not set to zero in $DEFAULTCFG"
  export PASSWORD="motdepassecodeserver"
	echo -n "Starting $DESC: "
	start-stop-daemon --start --quiet --make-pidfile --pidfile /var/run/"$NAME".pid \
	  --exec "$DAEMON" --retry 60 --background
	echo "--> $NAME."
	;;
  stop)
	echo -n "Stopping $DESC: "
	start-stop-daemon --stop --quiet --oknodo --pidfile /var/run/"$NAME".pid
	rm /var/run/"$NAME".pid
	echo "--> $NAME."
	;;
  restart|force-reload)
	test "$NO_START" = "0" || cancel "Restarting $DESC: [abort] NO_START is not set to zero in $DEFAULTCFG"
	echo -n "Restarting $DESC: "
	start-stop-daemon --stop --quiet --oknodo --pidfile /var/run/"$NAME".pid
	rm /var/run/"$NAME".pid
	sleep 2
	start-stop-daemon --start --quiet --make-pidfile --pidfile /var/run/"$NAME".pid \
          --exec "$DAEMON" --retry 60 --background
	echo "--> $NAME."
	;;
  status)
		status_of_proc -p /var/run/"$NAME".pid $DAEMON $NAME && exit 0 || exit $?
	;;
  *)
	N=/etc/init.d/$NAME
	echo "Usage: $N {start|stop|status|restart|force-reload}" >&2
	exit 1
	;;
esac

exit 0

```

Puis démarrer le service `/etc/init.d/code start` après avoir ajouté les droits d'exécution sur le script `sudo chmod +x /etc/init.d/code`

Lister les services: `service --status-all`

Voir si le pid file a bien été créé: `ls /var/run`

<br/>

## Répertoire partagé entre Android et Ubuntu 

Depuis Ubuntu, créer un fichier dans `touch /storage/internal/test-ubuntu-android.txt`.

Rendez-vous ensuite sur Android, ouvrez l'app Fichier et vérifiez que le nouveau fichier a bien été créé dans le répertoire **Téléphone --> Android --> data --> tech.ula --> files --> storage**
