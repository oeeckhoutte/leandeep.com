# Utiliser une boucle dans le terminal

- Canonical URL: https://leandeep.com/utiliser-une-boucle-dans-le-terminal/
- Author: Olivier Eeckhoutte
- Published: 2014-05-01T22:51:00Z
- Updated: 2014-05-01T22:51:00Z
- Language: fr
- Tags: Unix Tip, unix_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Dans la catégorie Scripts Shell:**

Si vous voulez exécuter plusieurs fois les mêmes actions sur une liste d'éléments, vous pouvez utiliser une boucle directement dans le terminal sans avoir besoin de script.

```
for VAR in LIST
> do
> # utilisez $VAR
> done
```

<br/>

Exemple:

```
$ for USER in olivier bob bill
> do
>  sudo passwd -l $USER
>  logger -t bad-boy $USER
>  done
Locking password for user olivier.
passwd: Success 
Locking password for user bob.
passwd: Success
Locking password for user bill.
passwd: Success
```

<br/>

Les commandes ci-dessus peuvent être écrites sur une ligne:

```
for USER in olivier bob bill; do sudo passwd -l $USER; logger -t bad-boy $USER; done
```

<br/>

Autre exemple plus utile: convertir tous les mp4 d'un dossier en mp3:
```
for FILE in *\ *
do
ffmpeg -f mp4 -i ${FILE} -f mp3 "${FILE%.mp4}.mp3"
done
```

