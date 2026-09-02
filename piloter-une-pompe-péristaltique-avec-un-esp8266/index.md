# Piloter une pompe péristaltique avec un esp8266

- Canonical URL: https://leandeep.com/piloter-une-pompe-p%C3%A9ristaltique-avec-un-esp8266/
- Author: Olivier Eeckhoutte
- Published: 2022-12-12T23:10:00Z
- Updated: 2022-12-12T23:10:00Z
- Language: fr
- Tags: esp, ESP32, esp8266, arduino
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Cet article fait suite à [mon article précédent](https://leandeep.com/compiler-et-uploader-son-code-sur-une-board-esp8266/) sur l'utilisation d'une board avec esp8266. Voici ici comment piloter le relai de la même board `ESP12F Relay X1 V2.1` en utilisant Blynk. C'est plus une prise de notes pour partage et reminder personel pour réutilisation future.

<br/>

## Utilisation de Blynk

* Créer un compte et "skipper" tous les quickstart guides et tutorials.
* Créer un nouveau template. Donnez lui le nom que vous souhaitez.
* Créer un datastream. Nommez le pompe par exemple et sélectionnez V0 comme PIN virtuel.
* Créer une automation. Nommez la pompe, sélectionnez le datastream que vous venez de créer et sélectionnez switch comme type d'automation.
* Dans web dashboard, drag and drop un switch button sur le dashboard/ grid et cliquez sur la wheel settings du switch button que vous venez de déposer.
* Dans les settings du switch button, sélectionnez pompe (V0) comme data stream et laissez "On value" = 1 et "Off value" = 0.
* Sauvegardez vos changements dans Blynk
* Ouvrir Arduino IDE et installer le librairie Blynk depuis la section Manage libraries.
* On ne va pas créer un projet Blynk from scratch. On va ouvrir un projet example Blynk. Pour ce faire, cliquez sur `Fichier` -> `Examples` -> `Blynk` -> `Blynk.Edgent` -> `Edgent_ESP8266`. L'IDE va ouvrir une nouvelle fenêtre avec plusieurs fichiers. Le fichier `Edgent_ESP8266.ino` ressemble à ceci:
```
// Fill-in information from your Blynk Template here
#define BLYNK_TEMPLATE_ID "..."
#define BLYNK_DEVICE_NAME "..."

#define BLYNK_FIRMWARE_VERSION        "0.1.0"

#define BLYNK_PRINT Serial
//#define BLYNK_DEBUG

#define APP_DEBUG


// Uncomment your board, or configure a custom board in Settings.h
//#define USE_SPARKFUN_BLYNK_BOARD
//#define USE_NODE_MCU_BOARD
//#define USE_WITTY_CLOUD_BOARD
//#define USE_WEMOS_D1_MINI

#include "BlynkEdgent.h"

void setup()
{
  Serial.begin(115200);
  delay(100);
  pinMode(PIN_RELAY, OUTPUT);
  BlynkEdgent.begin();
}

void loop() {
  BlynkEdgent.run();
}
```

* Retournez dans Blynk et copier le code "Firmware configuration" depuis la section "Info" de votre template. Voici un exemple du code dont je parle: 
```
#define BLYNK_TEMPLATE_ID "...."
#define BLYNK_DEVICE_NAME "..."
```
* Collez ce code à la place des lignes commentées dans votre fichier `Edgent_ESP8266.ino`.
* Ajouter la ligne suivante pour spécifier quel Pin sera utilisé sur la board.
```
#define PIN_RELAY 5
```

* Enfin ajouter le code suivant pour binder et intéragir avec le pin (ici 5) de la board au pin virtuel (v0).
```
BLYNK_WRITE(V0)
{
  if (param.asInt() == 1)
  {
    digitalWrite(PIN_RELAY, HIGH); 
  }
  else
  {
    digitalWrite(PIN_RELAY, LOW); 
  }
}
```

<br/>

## Code final

Voici le code du fichier principal `Edgent_ESP8266.ino` (le seul fichier que j'ai dû modifier):

```
// Fill-in information from your Blynk Template here
#define BLYNK_TEMPLATE_ID "VOTRE_ID"
#define BLYNK_DEVICE_NAME "LE_NOM_DE_VOTRE_DEVICE"

#define BLYNK_FIRMWARE_VERSION        "0.1.0"

#define BLYNK_PRINT Serial
//#define BLYNK_DEBUG

#define APP_DEBUG

#define PIN_RELAY 5


// Uncomment your board, or configure a custom board in Settings.h
//#define USE_SPARKFUN_BLYNK_BOARD
//#define USE_NODE_MCU_BOARD
//#define USE_WITTY_CLOUD_BOARD
//#define USE_WEMOS_D1_MINI

#include "BlynkEdgent.h"

void setup()
{
  Serial.begin(115200);
  delay(100);
  pinMode(PIN_RELAY, OUTPUT);
  BlynkEdgent.begin();
}

BLYNK_WRITE(V0)
{
  if (param.asInt() == 1)
  {
    digitalWrite(PIN_RELAY, HIGH); 
  }
  else
  {
    digitalWrite(PIN_RELAY, LOW); 
  }
}

void loop() {
  BlynkEdgent.run();
}

```

<br/>

## Pilotage via App mobile

Après avoir compilé et uploadé le sketch sur l'esp8266, il est maintenant temps de connecter l'esp8266 au wifi pour pouvoir piloter le relai via internet, donc depuis n'importe où.

Télécharger l'app Android `Blynk IoT` depuis le Play Store et cliquer sur "Add Device". Cliquer sur "Search nearby device". Il vous sera demandé d'activer le wifi sur votre téléphone. Faites le et sélectionnez le hotspot de votre esp8266. Une fois votre SmartPhone connecté à votre esp8266 en wifi, vous pourrez configurer le Wifi de votre esp8266 en sélectionnant le wifi de votre domicile et en entrant son mot de passe tout simplement. Une fois votre esp8266 configuré et connecté à internet, vous pourrez contrôler votre relai de n'importe où dans le monde et créer des automations plus avancées directement via Blynk dashboard. Il ne sera plus nécessaire d'intéragir avec le code. Cette solution Blynk est très bien pour créer de petits projets personnels très rapidement. 

Dans mon cas, je pilote des pompes péristaltiques comme celle ci:

![image](/images/pompe-peristaltique.jpg)

Et je peux les activer via l'app mobile Blynk. Par exemple:

![image](/images/blynk-interface-android.jpg)


