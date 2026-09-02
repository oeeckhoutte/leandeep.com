# Extraire et importer toutes ses clés GPG

- Canonical URL: https://leandeep.com/extraire-et-importer-toutes-ses-cl%C3%A9s-gpg/
- Author: Olivier Eeckhoutte
- Published: 2020-10-05T19:49:00+02:00
- Updated: 2020-10-05T19:49:00+02:00
- Language: fr
- Tags: GPG
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Export

Exporter toutes les clés publiques GPG dans un fichier base64:

```
gpg -a --export > /tmp/pub_gpg_keys.asc
```

<br/>

Exporter toutes les clés privées:

```
gpg -a --export-secret-keys > /tmp/private_gpg_keys.asc
```

<br/>

Exporter la trust database:

```
gpg --export-ownertrust > trust_gpg_db.txt
```

<br/>

## Import 

Après avoir copié les fichiers sur une nouvelle machine et installé GPG, importer les clés:

```
gpg --import ./private_gpg_keys.asc
gpg --import ./pub_gpg_keys.asc
gpg --import-ownertrust ./trust_gpg_db.txt
gpg -K
gpg -k
```

<br/>

## Commandes utiles

* Lister ses clés publiques: `gpg --list-keys`

* Lister ses clés privées: `gpg --list-secret-keys`

* Effacer une clé publique: `gpg --delete-key ...`

* Effacer une clé privée: `gpg --delete-secret-key ...`

