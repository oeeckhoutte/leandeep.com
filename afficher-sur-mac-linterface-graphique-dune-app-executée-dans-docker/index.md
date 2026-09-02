# Afficher sur Mac l'interface graphique d'une app executée dans Docker

- Canonical URL: https://leandeep.com/afficher-sur-mac-linterface-graphique-dune-app-execut%C3%A9e-dans-docker/
- Author: Olivier Eeckhoutte
- Published: 2020-03-28T16:49:00+02:00
- Updated: 2020-03-28T16:49:00+02:00
- Language: fr
- Tags: Docker
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Depuis quelque temps je travaille sur l'apprentissage de robots dans ROS. 
Je fais tourner ROS sans un container Docker et accède à l'interface graphique via VNC (dans le browser avec noVNC). Ce n'est clairement pas une solution qui me contient. Le clavier est mal supporté, les performances sont mauvaises. Je cherche donc une solution de remplacement pour piloter à distance l'outil ROS. En faisant des recherches sur internet, je suis parvenu à afficher l'interface graphique d'une app exécutée dans un container Docker sur mon Mac. L'application est basique mais cette piste est à explorer. Voici comment afficher une app basique sur Mac.

<br/>

## Steps 

**Configurer Xquartz**

Ouvrir Xquartz et rendez-vous dans les préférences. 
```
open -a Xquartz
```

Dans l'onglet "Sécurité" cocher la case "Allow connections from network clients".

<br/>

**Lancer socat**

Si vous ne l'avez pas déjà, installer `socat` via la commande `brew install socat` puis dans un terminal exécuter la commande suivante:

```
socat TCP-LISTEN:6000,reuseaddr,fork UNIX-CLIENT:\"$DISPLAY\"
```

> Socat permet de manipuler des sockets réseau.

<br/>

**Lancer une app dans un container**


```
export macbook_ip=IP_MACBOOK_SUR_LAN
docker run -it --rm -e DISPLAY=$macbook_ip:0 fr3nd/xeyes
```

<br/>

Voici le Dockerfile de cette image:
```
FROM debian:jessie

RUN apt-get update && apt-get install -y \
      x11-apps \
      && rm -rf /usr/share/doc/* && \
      rm -rf /usr/share/info/* && \
      rm -rf /tmp/* && \
      rm -rf /var/tmp/*

RUN useradd -ms /bin/bash user
USER user
CMD xeyes
```

A priori, il n'y a donc pas grand chose à installer pour que cela fonctionne. A voir ce que cela va donner pour ROS desktop...

<br/>

**Résultat**

![image](/images/remote_app_eyes.png)

