# Virtualbox headless sur Ubuntu 20.04

- Canonical URL: https://leandeep.com/virtualbox-headless-sur-ubuntu-20.04/
- Author: Olivier Eeckhoutte
- Published: 2021-03-20T09:25:00Z
- Updated: 2021-03-20T09:25:00Z
- Language: fr
- Tags: Ubuntu, Virtualization
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Bien sûr il y a Docker mais parfois on ne peut pas faire autrement que d'utiliser une VM...

<br/>

## Installation

```
sudo wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo apt-key add -
echo "deb [arch=amd64] https://download.virtualbox.org/virtualbox/debian focal contrib" | sudo tee /etc/apt/sources.list.d/virtualbox.list
sudo apt update
sudo apt-get install --yes virtualbox-6.1
sudo systemctl status vboxdrv

sudo usermod -aG vboxusers $USER
```

<br/>

Comme notre serveur est headless, il nous faut un accès remote. Pour ce faire, nous devons installer l'extension Oracle. 

```
VBOXVER=`vboxmanage -v | cut -dr -f1`
wget -P /tmp https://download.virtualbox.org/virtualbox/$VBOXVER/Oracle_VM_VirtualBox_Extension_Pack-$VBOXVER.vbox-extpack
vboxmanage extpack install /tmp/Oracle_VM_VirtualBox_Extension_Pack-$VBOXVER.vbox-extpack
```

<br/>

## Création première VM

```
sudo mkdir -p /srv/virtualbox

# Création VM
sudo vboxmanage createvm \
    --ostype Ubuntu_64 \
    --basefolder "/srv/virtualbox" \
    --register \
    --name "Test_to_delete"

# Modification de la config de la VM (NAT network, mémoire, VRDE pour accéder à la VM via rdp)
sudo vboxmanage modifyvm "Test_to_delete" \
    --memory 1024 \
    --nic1 nat \
    --vrde on 
    --vrdeport 33890

# Création d'un disque
sudo vboxmanage createhd \
    --filename "/srv/virtualbox/Test_to_delete/Test_to_delete.vdi" \
    --format VDI --size 10240

sudo vboxmanage storagectl "Test_to_delete" \
    --name "SATA" \
    --add sata

sudo vboxmanage storageattach "Test_to_delete" \
    --storagectl SATA --port 0 --type hdd \
    --medium "/srv/virtualbox/Test_to_delete/Test_to_delete.vdi"

# Démarrage de la VM
sudo vboxmanage startvm "Test_to_delete" --type headless

```

<br/>

## Bridge avec host

```
sudo VBoxManage modifyvm "Test_to_delete" --nic1 bridged
```

<br/>

## Bridge privé

```
sudo brctl addbr vmtestbr1 
sudo ifconfig testtodeletebr1 192.168.222.1 netmask 255.255.255.0 up
sudo ping -c 2 192.168.222.1
sudo vboxmanage modifyvm "Test_to_delete" --nic1 bridged --nictype1 82545EM --bridgeadapter1 testtodeletebr1

# Supprimer le bridge
sudo ifconfig testtodeletebr1 0.0.0.0 down
sudo brctl delbr testtodeletebr1
```

<br/>

Ping from guest to host

```
sudo ifconfig -a  
# interface name may be different 
sudo ifconfig eth0 192.168.222.2 netmask 255.255.255.0
sudo ping -c 4  192.168.222.1
```

<br/>

## Autres commandes

**Stopper VM**
```
sudo vboxmanage controlvm "Test_to_delete" poweroff
```

<br/>

**Lister toutes les VMs**
```
sudo VBoxManage list vms
```

<br/>

**Lister les VMs qui tournent**
```
sudo VBoxManage list runningvms
```

<br/>

**Entrer dans une machine virtuelle**
```
sudo VBoxManage showvminfo "Test_to_delete" | grep Rule
sudo VBoxManage modifyvm "Test_to_delete" --natpf1 "ssh,tcp,,3022,,22"
ssh -p 3022 <user>@127.0.0.1
```

<br/>

**Effacer une VM**
```
sudo VBoxManage unregistervm --delete "Test_to_delete"
```

<br/>

## Script auto

Créer un fichier `createDebian.sh` et exécuter la commande suivante `chmod +x ./createDebian.sh && ./createDebian.sh TestDebian`
```
#!/bin/bash
MACHINENAME=$1
echo $MACHINENAME
MACHINENAME_DISK="${MACHINENAME}_DISK"
echo $MACHINENAME_DISK

# Download debian.iso
if [ ! -f ./debian.iso ]; then
    wget https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-10.8.0-amd64-netinst.iso -O debian.iso
fi

#Create VM
VBoxManage createvm --name $MACHINENAME --ostype "Debian_64" --register --basefolder `pwd`
#Set memory and network
VBoxManage modifyvm $MACHINENAME --ioapic on
VBoxManage modifyvm $MACHINENAME --memory 1024 --vram 128
VBoxManage modifyvm $MACHINENAME --nic1 nat
#Create Disk and connect Debian Iso
VBoxManage createhd --filename `pwd`/$MACHINENAME/$MACHINENAME_DISK.vdi --size 80000 --format VDI
VBoxManage storagectl $MACHINENAME --name "SATA Controller" --add sata --controller IntelAhci
VBoxManage storageattach $MACHINENAME --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium  `pwd`/$MACHINENAME/$MACHINENAME_DISK.vdi
VBoxManage storagectl $MACHINENAME --name "IDE Controller" --add ide --controller PIIX4
VBoxManage storageattach $MACHINENAME --storagectl "IDE Controller" --port 1 --device 0 --type dvddrive --medium `pwd`/debian.iso
VBoxManage modifyvm $MACHINENAME --boot1 dvd --boot2 disk --boot3 none --boot4 none



#Enable RDP
PORT="10001"
VBoxManage modifyvm $MACHINENAME --vrdemulticon on --vrdeport ${PORT}
VBoxManage modifyvm $MACHINENAME --vrdeextpack default
VBoxManage modifyvm $MACHINENAME --vrde on
VBoxManage modifyvm $MACHINENAME --vrdeport 3391
VBoxManage modifyvm $MACHINENAME --vrdeaddress 127.0.0.2

#Start the VM
echo "Port ${PORT}"
VBoxHeadless --startvm $MACHINENAME
# xfreerdp +clipboard /w:1920 /h:1080 /v:0.0.0.0:10001
```
