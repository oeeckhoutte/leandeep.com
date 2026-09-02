# Créer une VM de dev sec avec Vagrant

- Canonical URL: https://leandeep.com/cr%C3%A9er-une-vm-de-dev-sec-avec-vagrant/
- Author: Olivier Eeckhoutte
- Published: 2017-12-01T13:49:00Z
- Updated: 2017-12-01T13:49:00Z
- Language: fr
- Tags: Security, Vagrant
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Si vous faites du développement Ansible et que vous avez besoin de tester rapidement votre playbook sur une VM "jetable" vous pouvez utiliser Vagrant.

Pour ce faire, rien de plus simple. Il vous suffit de créer un ficher `Vagrantfile` dans le répertoire de votre projet. Cela permettra de le backuper au passage et d'exécuter la commande `vagrant up`.

Sur votre machine il faudra que Virtualbox soit installé en amont. 

Voici à quoi ressmeble mon Vagrantfile:

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  #config.vm.box = "centos/atomic-host"
  config.vm.box = "centos/7"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL
end
```

Une fois la VM provisionnée, il suffit de faire un `vagrant ssh` pour s'y connecter.

Copiez la clé publique de votre MAC sur votre VM pour pourrez faire un SSH (utilisateur vagrant par défaut) dessus et exécuter vos playbooks via Ansible.

> Pour vous connecter en tant que `root`, il faudra modifier le fichier de configuration `/etc/ssh/sshd_config` et fixer le paramètre `PermitRootLogin` à `yes`.

Pour stopper et effacer une VM vous pouvez utiliser la commande suivante `vagrant halt && vagrant destroy -f`.

<br/>

Voici un autre Vagrantfile pour la distro Kali pour tester la sécurité de vos applications...
```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "kalilinux/rolling"

  # Create a forwarded port
  config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a private network. In VirtualBox, this is a Host-Only network
  config.vm.network "private_network", ip: "192.168.33.10"

  # VirtualBox specific settings
  config.vm.provider "virtualbox" do |vb|
    # Hide the VirtualBox GUI when booting the machine
    vb.gui = false

    # Customize the amount of memory on the VM:
    vb.memory = "4096"
  end

  # Provision the machine with a shell script
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y crowbar zsh wget curl
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
  SHELL
end
```

> `vagrant reload` permet de prendre en compte le changement de configuration du Vagrantfile sans devoir détruire et recréer le VM.

> Les options suivantes peuvent également servir:
> ```
> vagrant provision  # provision the powered on VM
> vagrant up --provision  # when VM is powered off, power it on then provision
> vagrant reload --provision  # reboot the VM then provision
> ```

> Pour utiliser `ansible-console` sur cette nouvelle VM et spécifier un utilisateur on peut utiliser la commande suivante `
ansible-console -i ./ansible/inventory/local --become -u root`

> Default credentials: root/toor

> Allow SSH to Remote Kali: <br/>
On local PC: `ssh-keygen -R ip_remote_kali` <br/>
Editer `/etc/ssh/sshd_config`, ajouter la ligne suivante `PermitRootLogin yes` et restart SSH `/etc/init.d/ssh restart`

> Ouvrir File Manager en mode admin: `sudo thunar`

> Pour installer vagrant sur OSX: `brew cask install vagrant`

> Box Ubuntu utiliser "ubuntu/bionic64"
