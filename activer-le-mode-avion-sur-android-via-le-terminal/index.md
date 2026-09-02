# Activer le mode avion sur Android via le terminal

- Canonical URL: https://leandeep.com/activer-le-mode-avion-sur-android-via-le-terminal/
- Author: Olivier Eeckhoutte
- Published: 2019-08-25T14:25:00Z
- Updated: 2019-08-25T14:25:00Z
- Language: fr
- Tags: Android, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Cet article très court décrit comment activer le mode avion sur un Smartphone Android via `ADB (Android Debug Bridge)`. Pour ceux qui ne connaissent pas ADB, [voici un lien vers le site officiel](https://developer.android.com/studio/command-line/adb).

Avec les commandes suivantes on peut activer ou désactiver le mode avion:

```
# Activer le mode avion
adb shell settings put global airplane_mode_on 1

# Désactiver le mode avion
adb shell settings put global airplane_mode_on 0
```

> Si vous avez besoin de broadcaster un intent aux applications du téléphone, c'est possible via la commande `adb shell am broadcast -a android.intent.action.AIRPLANE_MODE`.


