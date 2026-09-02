# Run Kali in headless mode via Virtualbox on Ubuntu 18.04

- Canonical URL: https://leandeep.com/run-kali-in-headless-mode-via-virtualbox-on-ubuntu-18.04/
- Author: Olivier Eeckhoutte
- Published: 2019-07-06T14:51:23Z
- Updated: 2019-07-06T14:51:23Z
- Language: fr
- Tags: Security, Virtualbox
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


I needed to create a Wifi hotspot.
Here are the necessary commands to install Kali on Virtualbox on Ubuntu 18.04.

<br/>

## Install Virtualbox

```
sudo apt update
sudo apt upgrade
```

<br/>

Import the Oracle public key to your system:
```
wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo apt-key add -
wget -q https://www.virtualbox.org/download/oracle_vbox.asc -O- | sudo apt-key add -
```

<br/>

Add Oracle VirtualBox PPA. The command below will add an entry at the end of the file  `/etc/apt/sources.list`.
```
sudo add-apt-repository "deb http://download.virtualbox.org/virtualbox/debian bionic contrib"
```

<br/>

Install:
```
sudo apt update
sudo apt install virtualbox-6.0
```

<br/>

## Install Network tools

```
apt-get install inetutils-tools bridge-utils -y
```

<br/>

## Create VM via command lines

```
vboxmanage createvm --name "kalivm" --ostype Ubuntu_64 --register
vboxmanage modifyvm "kalivm" --memory 4096 --acpi on --cpus 2
vboxmanage modifyvm "kalivm" --nic1 bridged --nictype1 82545EM --bridgeadapter1 eno1
vboxmanage storagectl "kalivm" --name "IDE Controller" --add ide --controller PIIX4
vboxmanage createhd --filename "/home/olivier/VirtualBox VMs/kalivm/kalivm.vdi" --size 20000
vboxmanage storageattach "kalivm" --storagectl "IDE Controller" --port 0 --device 0 --type hdd --medium "/home/olivier/VirtualBox VMs/kalivm/kalivm.vdi"
vboxmanage storageattach "kalivm" --storagectl "IDE Controller" --port 1 --device 0 --type dvddrive --medium /home/olivier/Downloads/kali-linux-2019.2-amd64.iso
vboxmanage startvm "kalivm" --type headless

# stop vm
vboxmanage controlvm "kalivm" poweroff
# delete vm
vboxmanage unregistervm "kalivm" --delete
```

<br/>

## Enable ssh on Kali

```
sudo apt-get update
sudo apt-get install -y ssh

systemctl enable ssh
systemctl start ssh
```

<br/>

## Change password

Kali use root/toor as default linux credentials. Do not forget to change them...

<br/>

## SSH with password

If you want to SSH to your Kali VM with a password you need to edit the `/etc/ssh/sshd_config` file and change the line `PermitRootLogin prohibit-password` by this one `PermitRootLogin yes`. (Uncomment it also...)

Once it is done restart the ssh service `service ssh restart`.

<br/>

## Install extension pack

To access USB devices from the Host inside the VM the extension pack is necessary.
```
vboxversion=$(wget -qO - https://download.virtualbox.org/virtualbox/LATEST.TXT)

wget "https://download.virtualbox.org/virtualbox/${vboxversion}/Oracle_VM_VirtualBox_Extension_Pack-${vboxversion}.vbox-extpack"

sudo vboxmanage extpack install --replace Oracle_VM_VirtualBox_Extension_Pack-${vboxversion}.vbox-extpack

```

Once it is installed it is important that your host user belongs to the `vboxusers` group. If it does not Virtualbox won't ba able to access the host USB.

To add your user in the `vboxusers` group just execute:

```
sudo usermod -a -G vboxusers your_user
```




