# Installer un eGPU Razer Core X sur Fedora 41 et faire tourner Pytorch

- Canonical URL: https://leandeep.com/installer-un-egpu-razer-core-x-sur-fedora-41-et-faire-tourner-pytorch/
- Author: Olivier Eeckhoutte
- Published: 2025-01-23T23:32:00+02:00
- Updated: 2025-01-23T23:32:00+02:00
- Language: fr
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article écrit très rapidement, nous allons voir comment installer un GPU dans un boitier eGPU Razer Core X. L'ajout de cet eGPU permet d'avoir plus de puissance de calcul comparé au CPU pour l'inférence de modèles avec Pytorch.

<br/>

**Activez le dépôt RPM Fusion**

> Le dépôt RPM Fusion fournit les pilotes NVIDIA officiels pour Fedora.

```
sudo dnf install \
    https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm \
    https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```


<br/>

```
sudo dnf upgrade --refresh
```

<br/>

**Installez les pilotes NVIDIA**

```
sudo dnf install akmod-nvidia
sudo dnf install xorg-x11-drv-nvidia-cuda
sudo reboot
```

<br/>

**Vérifiez l'installation**

```
nvidia-smi

sudo dnf install python3.11
sudo alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
sudo alternatives --display python3
python3 --version
curl -O https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py
pip --version
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

<br/>


Créer un fichier main.py pour vérifier que Pytorch est accessible et détecte bien votre GPU.

```
import torch

print("Is CUDA available:", torch.cuda.is_available())
print("Number of GPUs:", torch.cuda.device_count())
print("Current GPU:", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None")

if torch.cuda.is_available():
    x = torch.tensor([1.0, 2.0, 3.0], device='cuda')
    print(x)
```


<br/>

**Troubleshooting**

Si vous rencontrez l'erreur suivante:

`NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver. Make sure that the latest NVIDIA driver is installed and running.`

Alors autoriser l'accès au thunderbolt via la commande:

```
echo 1 | sudo tee /sys/bus/thunderbolt/devices/*/authorized

# Voir si le eGPU est accessible:
# sudo dnf install bolt 
# sudo systemctl restart bolt
# boltctl list
```

