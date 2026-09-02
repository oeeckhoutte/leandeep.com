# Installer Arduino cli Ubuntu 22

- Canonical URL: https://leandeep.com/installer-arduino-cli-ubuntu-22/
- Author: Olivier Eeckhoutte
- Published: 2025-03-28T09:49:00+02:00
- Updated: 2025-03-28T09:49:00+02:00
- Language: fr
- Tags: Arduino, tips, ESP32
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Dans ce nouvel article très court, nous allons voir comment créer un projet Arduino, le compiler et le déployer sur un ESP en ligne de commande.


<br/>

## Installation

```
mkdir -p ~/local/bin
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=~/local/bin sh
echo 'export PATH="$HOME/local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
arduino-cli version


arduino-cli core update-index
arduino-cli core install esp32:esp32
arduino-cli sketch new mon_projet_esp32_arduino
arduino-cli compile --fqbn esp32:esp32:esp32 mon_projet_esp32_arduino
arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 mon_projet_esp32_arduino
```

<br/>

## Test

Ouvrir le projet Arduino mon_projet_esp32_arduino et modifier le fichier .ino.
Insérer le code suivant:

```
#define LED 2

void setup() {
  // Set pin mode
  pinMode(LED,OUTPUT);
}

void loop() {
  delay(50);
// you can set the delay time by adjusting the parameter of delay();
  digitalWrite(LED,HIGH);
  delay(50);
  digitalWrite(LED,LOW);
}
```

<br/>

Puis pour rebuid et redeploy:

```
arduino-cli compile --fqbn esp32:esp32:esp32 mon_projet_esp32_arduino
arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 mon_projet_esp32_arduino
```

<br/>

## Troubleshooting

```
arduino-cli monitor -p /dev/ttyUSB0 -c baudrate=115200
```
