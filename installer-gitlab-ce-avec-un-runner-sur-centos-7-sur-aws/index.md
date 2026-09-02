# Installer Gitlab CE avec un runner sur Centos 7 sur AWS

- Canonical URL: https://leandeep.com/installer-gitlab-ce-avec-un-runner-sur-centos-7-sur-aws/
- Author: Olivier Eeckhoutte
- Published: 2019-09-02T21:21:00Z
- Updated: 2019-09-02T21:21:00Z
- Language: fr
- Tags: Centos7, Gitlab, AWS
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Dans cet article nous allons voir comment installer et configurer Gitlab CE pour construire des pipelines automatiques CICD.

<br/>

## Installation de Gitlab CE
```
yum update

yum -y install curl vim policycoreutils openssh-server openssh-clients postfix

# Vérifiez que Firewalld n'est pas démarré sans quoi il faudra le configurer ou le désactiver si vous utilisez les *security groups* d'AWS par exemple
systemctl status firewalld

# Vérifiez que les services sont bien démarrés
systemctl status sshd
systemctl status postfix

# Installer le repository pour Gitlab
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash

# Installer Gitlab
yum -y install gitlab-ce

```

<br/>

## Configuration du DNS en HTTPS

Gitlab est maintenant installé. Pour configurer un DNS et du HTTPS, voici ce qu'il faut modifier dans le fichier `/etc/gitlab/gitlab.rb`.

```
external_url 'https://gitlab.votre_domaine.com'

letsencrypt['enable'] = true
letsencrypt['contact_emails'] = ['votre_adresse_email@votre_domaine.com']
letsencrypt['auto_renew'] = true
letsencrypt['auto_renew_hour'] = 0
```

Une fois ce fichire modifié il faut reconfigurer Gitlab pour que les modifications soient prises en compte avec la commande `gitlab-ctl reconfigure`.

Rendez-vous à l'adresse DNS que vous avez spécifié en HTTPS pour voir le Gitlab up and running. 

Redémarrer la machine pour être certain que tout est bien installé et que Gitlab se lance bien au startup.

<br/>

## Installation du CI

```
curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64

useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash

gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner

/usr/local/bin/gitlab-runner register
# Suivez les instructions. Elles sont très simples
```

Et voilà. Vous avez maintenant un runner pour votre pipeline CICD. 

Rendez-vous maintenant sur le DNS de votre Gitlab, commencez par renseigner un mot de passe superadmin et rendez-vous dans les settings pour voir le nouveau runner enregistré.

<br/>

## Synchroniser Gitlab avec d'autre Git providers

J'ai suivi la documentation de cet article et j'ai pu brancher d'autres Git provider (i.e Github ou Bitbucket) à mon Gitlab: https://docs.gitlab.com/ee/integration/bitbucket.html

