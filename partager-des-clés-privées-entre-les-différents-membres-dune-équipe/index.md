# Partager des clés privées entre les différents membres d'une équipe

- Canonical URL: https://leandeep.com/partager-des-cl%C3%A9s-priv%C3%A9es-entre-les-diff%C3%A9rents-membres-dune-%C3%A9quipe/
- Author: Olivier Eeckhoutte
- Published: 2018-11-01T19:37:00Z
- Updated: 2018-11-01T19:37:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Lorsqu'on travaille dans une équipe de Devops il n'est pas rare de devoir partager des fichiers sécurisés (clés privées...). Ce sont les fichiers que l'on doit impérativement sauvegarder (si le Devops est en congés ou quitte l'entreprise) et que l'on ne peut pas mettre sur Git.

<br/>

Pour ce genre de fichiers heureuesement il y a des outils comme EncFS qui permettent de crypter des dossiers. On peut ainsi créer un dossier dans un espace partagé (Dropbox, Google Drive...), le partager à toute une équipe et seules les personnes qui ont le mot de passe pourront le décrypter. L'intérêt d'EncFS est qu'il est cross-platforms. Il y a des clients pour Windows, Linux, OSX, Android et iOS...

<br/>

Voici l'installation sur OSX.

```
brew install osxfuse
brew install sshfs
brew install encfs
```

<br/>

Ensuite il n'y a plus qu'à exécuter la commande suivante pour créer un répertoire crypté sur Dropbox par exemple. 

```
encfs ~/Dropbox/dossier_securise ~/dossier_securise
```

<br/>

Tout ce que vous déposerez dans ~/dossier_securise sera crypté à la volé, copié dans le répertoire Dropbox et donc synchronisé avec les personnes de votre choix. 
Tant que ces personnes n'auront pas à leur tour monté le dossier de Dropbox dans un répertoire local via encfs, elles ne verront que des fichiers crypté comme ceci: 

```
.encfs6.xml
25G6HONULIE75F57UMITNZR2GBEJF
```


