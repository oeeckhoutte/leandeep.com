# Forcer le montage d'un disque dur externe mal éjecté et plus détecté sur Mac OSX et backup Synology

- Canonical URL: https://leandeep.com/forcer-le-montage-dun-disque-dur-externe-mal-%C3%A9ject%C3%A9-et-plus-d%C3%A9tect%C3%A9-sur-mac-osx-et-backup-synology/
- Author: Olivier Eeckhoutte
- Published: 2021-12-18T20:49:00+02:00
- Updated: 2021-12-18T20:49:00+02:00
- Language: fr
- Tags: OSX
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


### Sauvegarde d'un Synlogy en PLS

La semaine dernière mon Synology de 2 disques DS213 s'est mis à biper sans arrêt car un des disques du RAID était HS. Quand cela arrive, il faut remplacer le disque défectueux afin que les données perdues soient reconstruites et ne pas tout perdre si le second disque venait à lâcher en même temps. N'ayant pas de disque sous la main, j'ai tout de suite fait un backup sur un disque externe USB de 14 To grâce via mon Mac. Oubliez les transfers via SMB ou AFT trop long. L'indexation des fichiers peut en effet prendre plusieurs jours. J'ai fait le backup via rsync avec des commandes comme celle ci: `rsync --partial -r --progress admin@NAS_oliviere.local:/volume1/photo /Volumes/USB/Synology`. Je m'étais d'abord connecté en SSH pour lister les répertoires à backuper via la commande: `ssh -p 28 admin@nas_oliviere.local`.
Cela m'a quand même pris 2 jours pour tout copier malgré une connexion en direct du Mac vers le Synology...

<br/>

### Disque dur externe non reconnu

Après avoir terminé mon backup, j'ai débranché comme une brute mon disque dur externe USB de mon Mac et lorsque j'ai voulu le rebrancher, il ne se montait plus. Il m'était impossible de monter la partition ExtFS ou de la réparer via l'utilitaire de disque. (Après 2 jours de backup, je me suis dit que c'était logique, c'était la fameuse loi des séries...).
Le disque était détecté mais la partition ne se montait plus. 

Le problème venait de fsck (Filesystem Check) d'OSX. Lorsque je branchais mon disque, OSX essayait de réparé le disque mal éjecté et le processus ne se terminé jamais.

J'ai donc killé le processus via les commandes `ps aux | grep fsck` et `kill -9 PID`. En faisait cela, le disque se monte instantanément en lecture seule. Pour pouvoir à nouveau écrire dessus, il faut réparer le disque via `Disk Utility`.


<br/>

### Leçon retenue

1. Avoir un backup de son Synology. Cela fait des mois que je dis que je vais le faire et je me suis fait avoir... Le backup doit être à l'extérieur de chez soi. Synology propose un service de backup automatique vers le cloud ou vers un second Synology. Je vais personnellement me doter d'un nouveau Synology DS1520+ avec 5 disques et utiliser mon DS213 comme Synology de Backup avec des disques renouvelés que je garderais en dehors de chez moi.

2. Ejecter proprement son disque USB externe. Maintenant j'utilise les commandes suivantes avant d'enlever le cable USB de mon disque dur externe:

```
diskutil unmountDisk /dev/disk2
# diskutil unmountDisk force /dev/disk2
hdiutil eject disk2
```

ou alias pour `~/.zshrc`...

```
eject ()
{
    diskutil unmountDisk /dev/disk2
    hdiutil eject disk2
}
```
