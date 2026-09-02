# Créer une VM de dev Windows avec Vagrant

- Canonical URL: https://leandeep.com/cr%C3%A9er-une-vm-de-dev-windows-avec-vagrant/
- Author: Olivier Eeckhoutte
- Published: 2019-09-16T12:56:00Z
- Updated: 2019-09-16T12:56:00Z
- Language: fr
- Tags: Ansible, Vagrant
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Introduction

Dans cet article nous allons voir comment installer en quelques secondes une VM Windows 10 de développement. Cet article fait suite à un premier que j'avais écrit mais pour Windows: https://leandeep.com/creer-une-vm-de-dev-pour-ansible-avec-vagrant/ . L'idée est d'avoir une VM de test pour réaliser 2 ou 3 tâches de dev et de la détruire une fois que c'est terminé.

<br/>

## Marketplace

Chercher une box Windows sur la marketplace de Vagrant.

https://app.vagrantup.com/boxes/search?utf8=%E2%9C%93&sort=downloads&provider=&q=windows

> Attention à ce que vous trouvez sur la Marketplace. Les box que vous téléchargez peuvent contenir des virus ou autres codes malveillants. Idem pour les images Docker que vous trouvez sur le net ou sur Dockerhub... 

<br/>

## Pré-requis:

* Vagrant installé 
* Virtualbox installé 

<br/>

## Création de la VM

Dans un répertoire de développement, créer un fichier appelé `Vagrantfile` et insérer le contenu suivant: 

```
Vagrant.configure("2") do |config|
  config.vm.box = "vdelarosa/windows-10"
end
```

Executez la commande `vagrant up` et voilà la VM que vous avez trouvé sur la Marketplace va se provisioner et se lancer automatiquement. Il vous faudra une bonne connexion internet car les VMs Windows sont tout sauf légères. 

> Pour vous connecter à la VM Windows les crédentials par défaut sont les suivants: `vagrant / vagrant`. **Attention au clavier en qwerty ;)**

<br/>

## Clean boxes

Cela peut être utile d'effacer les boxes téléchargées pour faire de l'espace sur votre poste. 

```
vagrant box list
vagrant box remove -f [name]
```

Si cela ne fonctionne pas, tout ce qui est téléchargé lors du provisioning va dans ce répertoire: `~/.vagrant.d/boxes` (sur Mac)...

