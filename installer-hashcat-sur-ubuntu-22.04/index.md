# Installer Hashcat sur Ubuntu 22.04

- Canonical URL: https://leandeep.com/installer-hashcat-sur-ubuntu-22.04/
- Author: Olivier Eeckhoutte
- Published: 2025-02-06T23:32:00+02:00
- Updated: 2025-02-06T23:32:00+02:00
- Language: fr
- Tags: Linux
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article, nous allons voir comment installer Hashcat v6.2.5 sur Ubuntu 22 (PopOS).

<br/>

**Pré-requis**

`nvidia-smi` déjà installé.

<br/>

**Installation de hashcat**

```
sudo apt update
sudo apt upgrade
apt install hashcat
```

<br/>

**Installation de Cuda Toolkit 11.7**

```
wget https://developer.download.nvidia.com/compute/cuda/11.7.0/local_installers/cuda_11.7.0_515.43.04_linux.run
sudo sh cuda_11.7.0_515.43.04_linux.run
# Installer Cuda et refuser l'installation du Driver Nvidia
# Une fois l'installation terminée, ajouter cuda au bashrc

echo "export PATH=/usr/local/cuda-11.7/bin:$PATH" >> ~/.bashrc
echo "export LD_LIBRARY_PATH=/usr/local/cuda-11.7/lib64:$LD_LIBRARY_PATH" >> ~/.bashrc
```

<br/>

**Vérification**

```
nvcc --version
hashcat -I

Test de crack du MD5 suivant: 82a4b202be22fbbcd236d2f65988acde pour vérifier que les GPUs sont ok.
echo "82a4b202be22fbbcd236d2f65988acde" > hash.txt
hashcat -a 3 -m 0 --increment --increment-min=1 --increment-max=20 hash.txt -1 ?l?u?d ?1?1?1?1?1?1?1?1?1?1?1?1?1?1?1?1?1?1?1?1
```

<br/>

**Extraire des hashes (d'un zip par exemple)**

```
sudo apt install john build-essential libssl-dev zlib1g-dev -y
git clone "https://github.com/magnumripper/JohnTheRipper.git" && cd JohnTheRipper/src && ./configure && sudo make -s clean && sudo make -sj4 

# Trouver le path de zip2john
sudo find / -name zip2john 2>/dev/null
echo "export PATH=/home/olivier/JohnTheRipper/run:$PATH" >> ~/.bashrc
zip2john archive.zip > archive.hash

# Ou sur OSX 
/opt/homebrew/Cellar/john-jumbo/1.9.0_1/share/john/zip2john archive.zip > archive.hash
```

<br/>

**Trouver un mot de passe**
```
# Cleaner le hash du zip
sed 's/^.*\(\$pkzip\$.*\$\/pkzip\$\).*/\1/' archive.hash > fixed.hash

# Exemples: 
## Exemple 1 pour mot de passe monMotDePasse:
$pkzip2$1*2*2*0*11*5*3bb935c6*0*46*0*11*3bb9*7421*049b7aaecce339b3f7252da83f0a1b1231*$/pkzip2$
## Exemple 2 pour mot de passe monMDP:
$pkzip2$1*2*2*0*15*9*4af10d19*0*46*0*15*4af1*8d6f*651a278b80d96268b1a8ec6cbc400c7ebc6592f377*$/pkzip2$

- Mode 13600 (ou similaire) pour le chiffrement traditionnel (ZipCrypto).
- Mode 17210 pour les archives utilisant AES (PKZIP2).

# Pour du pkzip
hashcat -a 3 -m 13600 --increment --increment-min=1 --increment-max=20 fixed.hash ?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a
Ou
# Pour du pkzip2
hashcat -a 3 -m 17210 --increment --increment-min=1 --increment-max=20 fixed.hash ?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a?a
Ou
hashcat -m 17200 -a 3 -w 4 --optimized-kernel-enable fixed.hash ?a?a?a?a?a?a
```

Voir ~/.hashcat/hashcat.potfile pour le résultat ou `hashcat --show archive.hash`

<br/>

**Troubleshooting**

`Hashfile 'archive_hash.txt' on line 1 (archiv....04.png:archive.zip::archive.zip): Signature unmatched` -> Vérifiez le type de chiffrement utilisé:
  
```
sudo apt install p7zip-full 
7z l -slt archive.zip | grep Method

Method = ZipCrypto → OK pour zip2john.
Method = AES-256 → Nécessite une approche différente.
```

<br/>

Bloquer la mise en veille automatique d'Ubuntu pour éviter que tout s'arrête...

```
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

