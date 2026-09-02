# Installer Hashcat sur Fedora 41

- Canonical URL: https://leandeep.com/installer-hashcat-sur-fedora-41/
- Author: Olivier Eeckhoutte
- Published: 2025-01-25T22:32:00+02:00
- Updated: 2025-01-25T22:32:00+02:00
- Language: fr
- Tags: Hashcat, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)




**Installation**

```
sudo dnf install hashcat hashcat-devel hashcat-doc
```


<br/>

**Vérifier si votre GPU est détecté**
```
hashcat -I
```

<br/>

**Réaliser un benchmark**
```
hashcat -b
```

<br/>

**Faire un test avec un hash MD5**

```
wget -c https://github.com/danielmiessler/SecLists/archive/master.zip -O SecList.zip \
  && unzip SecList.zip \
  && rm -f SecList.zip

echo "5d41402abc4b2a76b9719d911017c592" > test.hash
hashcat -m 0 -a 0 test.hash ~/Dev/SecLists-master/Passwords/xato-net-10-million-passwords-1000000.txt
```

