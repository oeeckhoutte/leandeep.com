# Enregistrer l'écran de son Mac avec le son built-in

- Canonical URL: https://leandeep.com/enregistrer-l%C3%A9cran-de-son-mac-avec-le-son-built-in/
- Author: Olivier Eeckhoutte
- Published: 2022-05-02T22:45:00Z
- Updated: 2022-05-02T22:45:00Z
- Language: fr
- Tags: OSX, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article très court, nous allons voir comment faire un screen recording avec le son built-in à partir de Quicktime sur Mac. Pas besoin de soft payant; juste d'un driver supplémentaire [open source](https://github.com/ExistentialAudio/BlackHole)

<br/>

## Installation du driver

Installer le driver virtuel permettant d'enregistrer le son built-in. 

```
brew install blackhole-16ch
```

<br/>

## Création de nouvelles interfaces audio

Ouvrir l'application officielle Apple `Audio MIDI setup`.

Nous allons créer 2 interfaces audio. Une en input et une en output.

**Première interface (input)**

En bas du menu de gauche cliquer sur le petit `+` puis créer un `Aggregated Device`.
Cocher la case Use BlackHole 16ch dans la fenêtre de droite et renommer l'interface en `Quicktime input`


**Deuxième interface (output)**

Créer une seconde interface `Multi-output Device`.

Nommer la `Screen Recording audio` puis sélectionner les devices `built-in Output` et `Blackhote 16ch` dans le menu de droite.


<br/>

## Test d'enregistrement de screen avec son

Dans `System Preferences` -> `Sound` -> `Output`, l'interface `Screen Recording audio` (Aggregated device) doit être sélectionnée; sans quoi le son émis par votre MAC ne sera pas enregistré.

Presser simultanément les touches `cmd + shift + 5` puis cliquer sur `Options`. Sélectionner l'interface `Quicktime input` et commencer un enregistrement. 

Lorsque l'enregistrement est terminé; retourner dans `System Preferences` -> `Sound` -> `Output` et remettre `Internal Speakers` comme sortie sonore. 

That's it!
