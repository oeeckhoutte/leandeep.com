# Compiler et uploader son code sur une board esp8266

- Canonical URL: https://leandeep.com/compiler-et-uploader-son-code-sur-une-board-esp8266/
- Author: Olivier Eeckhoutte
- Published: 2022-12-08T20:50:00Z
- Updated: 2022-12-08T20:50:00Z
- Language: fr
- Tags: ESP32, esp, esp8266, arduino
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Je suis en train de créer un arrosage automatique pour mes productions de emicro-pousses et régulateur de PH/ EC pour jardin hydroponique connecté.
Dans cet article, nous allons voir comment piloter la board `ESP12F Relay X1 V2.1` qui embarque un esp8266.

![image](/images/esp8266.png)

> Je cherchais à me mettre à jour sur l'IoT et j'ai découvert les vidéos des Frères Poulain disponibles sur Youtube. Je les recommande fortement [https://www.youtube.com/@lesfrerespoulain](https://www.youtube.com/@lesfrerespoulain) .

Après avoir cherché plusieurs heures comment envoyer mon code sur l'esp, car bien-sûr il n'y avait pas de documentation livré avec mon colis, je me dis que cela pourrait être utile de documenter la procédure.


<br/>

## Alimentation de la board en mode programmation

Tout simplement par usb. On ne s'embête à brancher quoique ce soit en mode développemeent. On branche le micro-usb.

<br/>

## Branchement usb-to-serial

Alimenter la board en énergie ne suffit pas. Il faut pouvoir envoyer son code dans l'esp.

Pour ce faire, il faut une carte usb-to-serial:

![image](/images/usb-to-serial.png)

> Voici la référence: `DSD TECH SH-U06B Adaptateur série USB vers TTL avec Puce PL2303GC`

Il faut relier:
- le pin RX de la carte au pin TX de la board esp (dans mon cas fil noir)
- le pin TX de la carte au pin RX de la board esp (dans mon cas fil bleu)
- le GND de la carte au GND de la board esp (dans mon cas fil rouge)

Ensuite il faut démarrer la board esp en mode programmation. Pour cela, il faut brancher un fil entre IO0 et GND et appuyer sur le bouton `reset`. Si un programme tourait, il s'arrête et vous pouvez flasher la board depuis Arduino IDE.

<br/>

## Configuration d'Arduino IDE

Après avoir installé Arduino IDE, l'ouvrir et aller dans `File` -> `Preferences`. Cliquer sur `Add URL` et ajouter l'URL suivante `https://arduino.esp8266.com/stable/package_esp8266com_index.json` dans la section `Additional Development Board Manager URL`.

Ensuite ajouter la libraire esp8266. Cliquer sur l'onglet `Tools` -> `Boards:` -> `Boards manager`. Puis dans la barre de recherche entrere `ESP8266` pour module/librairie esp8266 complémentaire.

Un fois installé, cliquer une nouvelle fois sur `Tools` -> `Boards:` -> `esp8266` et choisissez soit la board `ESPino (ESP-12 Module)` ou `Generic ESP8266 Module`.

<br/>

## Premier code

Voici le premier merveilleux code que j'ai écrit pour tester le bon fonctionnement de mon setup:

```
#define PIN_LED 16
#define PIN_RELAY 5

void setup() {
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_RELAY, OUTPUT);
  digitalWrite(PIN_LED, HIGH);
  digitalWrite(PIN_RELAY, HIGH);
}

void loop() {
  digitalWrite(PIN_LED, LOW);
  digitalWrite(PIN_RELAY, LOW);
  delay(5000);              
  digitalWrite(PIN_LED, HIGH);
  digitalWrite(PIN_RELAY, HIGH);
  delay(5000);
}
```

<br/>
Comment j'ai choisi ces PINs ?
<br/>
Via la seule doc que j'ai trouvé, mais bien utile!

![image](/images/gpio-esp8266.png)



<br/>

## Compilation/Upload

On clique sur `Upload` et si tout est bien branché et configuré, vous pourrez voir ces logs dans la console output d'Arduino:


```
Executable segment sizes:

ICACHE : 32768           - flash instruction cache 

IROM   : 231788          - code in flash         (default or ICACHE_FLASH_ATTR) 

IRAM   : 26793   / 32768 - code in IRAM          (IRAM_ATTR, ISRs...) 

DATA   : 1496  )         - initialized variables (global, static) in RAM/HEAP 

RODATA : 876   ) / 81920 - constants             (global, static) in RAM/HEAP 

BSS    : 25608 )         - zeroed variables      (global, static) in RAM/HEAP 

Sketch uses 260953 bytes (24%) of program storage space. Maximum is 1044464 bytes.
Global variables use 27980 bytes (34%) of dynamic memory, leaving 53940 bytes for local variables. Maximum is 81920 bytes.
esptool.py v3.0
Serial port COM3
Connecting....
Chip is ESP8266EX
Features: WiFi
Crystal is 26MHz
MAC: bc:ff:4d:f9:76:7a
Uploading stub...
Running stub...
Stub running...
Configuring flash size...
Auto-detected Flash size: 4MB
Compressed 265104 bytes to 195077...
Writing at 0x00000000... (8 %)
Writing at 0x00004000... (16 %)
Writing at 0x00008000... (25 %)
Writing at 0x0000c000... (33 %)
Writing at 0x00010000... (41 %)
Writing at 0x00014000... (50 %)
Writing at 0x00018000... (58 %)
Writing at 0x0001c000... (66 %)
Writing at 0x00020000... (75 %)
Writing at 0x00024000... (83 %)
Writing at 0x00028000... (91 %)
Writing at 0x0002c000... (100 %)
Wrote 265104 bytes (195077 compressed) at 0x00000000 in 17.7 seconds (effective 120.1 kbit/s)...
Hash of data verified.

Leaving...
Hard resetting via RTS pin...
```

Une fois votre code compilé et uploadé sur l'esp, retirer le cable entre IO0 et GND et cliquer sur le bouton reset sur la board.
Et voilà, le relais et une LED vont s'activer et se désactiver toutes les 5s.

<br/>

## Drivers pour OSX

Pour OSX, j'ai utilisé le driver `PL2303HXD_G_Mac Driver_v2.1.0_20210311.zip` disponible sur https://www.prolific.com.tw/US/ShowProduct.aspx?p_id=229&pcid=41


