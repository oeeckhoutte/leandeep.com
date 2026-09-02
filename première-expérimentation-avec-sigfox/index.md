# Première expérimentation avec Sigfox

- Canonical URL: https://leandeep.com/premi%C3%A8re-exp%C3%A9rimentation-avec-sigfox/
- Author: Olivier Eeckhoutte
- Published: 2015-12-27T20:11:00Z
- Updated: 2015-12-27T20:11:00Z
- Language: fr
- Tags: IoT, Sigfox
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Le mois dernier j'ai participé à un workshop autour de Sigfox.
Franchement j'ai été très impressionné par cette technologie et surtout par la couverture du réseau en France. 

L'intérêt de Sigfox c'est que cela consomme peu d'énergie (Tx: < 50 mA during a few seconds (25mW, 14dB)) mais on peut envoyer que 12 octets par message et jusqu'à 140 messages par capteur par jour.
 
Voici l'exemple qui a été donné en workshop:
On veut envoyer des coordonnées GPS, la tempêrature et reporter l'état du capteur.

Ces données vont être converties comme ceci: 
![image](/images/convert-data-sigfox.png)

Pour envoyer un hello-world sur le réseau Sigfox cela ressemble à ceci avec une carte Akeru beta 3.3 (Snootlab). C'est vraiment très simple.
Ensuite il suffit de se rendre sur Sigfox Cloud https://backend.sigfox.com/device/:deviceid/info et de cliquer sur son device pour voir les données. 


```
#include <SoftwareSerial.h>

SoftwareSerial sigfox(5,4);
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  sigfox.begin(9600);
  
  delay(300);
  
  sigfox.write("AT$SF=09AF0000CAFE,2,1\r");
  

}

void loop() {
  // put your main code here, to run repeatedly:
  while (sigfox.available()){
    Serial.write(sigfox.read());
  }
  
}
```


Il est ensuite possible d'utiliser des boards à base d'Arduino comportant toute une panoplie de capteurs avec une antenne Sigfox intégrée. Voici le code source permettant de remonter la tempêrature (°C), la pression (mbar) et l'humidité (%)

Voici un exemple de board intéressante pour faire du développement: [SmartEverything](https://fr.rs-online.com/web/p/kits-de-developpement-pour-radio-frequence/9015121/)

```
#include <LPS25H.h>
#include <HTS221.h>
#include <Wire.h>
#include <Arduino.h>

#define SIGFOX_FRAME_LENGTH 12
#define INTERVAL 600000
#define DEBUG 0

unsigned long previousSendTime = 0;

struct data {
  int humidity;
  float temperature;
  int pressure;
};


void setup() {
  // Init UART devices
  if (DEBUG) {
    SerialUSB.begin(115200);
  }
  smeHumidity.begin();
  smePressure.begin();
  
  SigFox.begin(19200);

  initSigfox();
}

void loop() {
  data frame;
  frame.humidity = smeHumidity.readHumidity();  
  frame.temperature = (smeHumidity.readTemperature() + smePressure.readTemperature())/2.0;
  frame.pressure = smePressure.readPressure();

  if (DEBUG) {
    SerialUSB.print("Temp ");
    SerialUSB.println(frame.temperature, 6);
    SerialUSB.print("\tHumidity ");
    SerialUSB.println(frame.humidity);
    SerialUSB.print("\tPressure ");
    SerialUSB.println(frame.pressure);
  }
 
  bool answer = sendSigfox(&frame, sizeof(data));

  // Light LED depending on modem answer
  if (answer) {
    ledGreenLight(HIGH);
    ledRedLight(LOW);
  } else {
    ledGreenLight(LOW);
    ledRedLight(HIGH);
  }
  delay(1000);
  ledGreenLight(LOW);
  ledRedLight(LOW);
  
  delay(INTERVAL);
}

void initSigfox(){
  SigFox.print("+++");
  while (!SigFox.available()){
    delay(100);
  }
  while (SigFox.available()){
    byte serialByte = SigFox.read();
    if (DEBUG){
      SerialUSB.print(serialByte);
    }
  }
  if (DEBUG){
    SerialUSB.println("\n ** Setup OK **");
  }
}
String getSigfoxFrame(const void* data, uint8_t len){
  String frame = "";
  uint8_t* bytes = (uint8_t*)data;
  
  if (len < SIGFOX_FRAME_LENGTH){
    //fill with zeros
    uint8_t i = SIGFOX_FRAME_LENGTH;
    while (i-- > len){
      frame += "00";
    }
  }

  //0-1 == 255 --> (0-1) > len
  for(uint8_t i = len-1; i < len; --i) {
    if (bytes[i] < 16) {frame+="0";}
    frame += String(bytes[i], HEX);
  }
  
  return frame;
}
bool sendSigfox(const void* data, uint8_t len){
  String frame = getSigfoxFrame(data, len);
  String status = "";
  char output;
  if (DEBUG){
    SerialUSB.print("AT$SF=");
    SerialUSB.println(frame);
  }
  SigFox.print("AT$SF=");
  SigFox.print(frame);
  SigFox.print("\r");
  while (!SigFox.available());
  
  while(SigFox.available()){
    output = (char)SigFox.read();
    status += output;
    delay(10);
  }
  if (DEBUG){
    SerialUSB.print("Status \t");
    SerialUSB.println(status);
  }
  if (status == "OK\r"){
    //Success :)
    return true;
  }
  else{
    return false;
  }
}

```


> Pour customiser le display type" de son device sur Sigfox Cloud: `pressure::uint:32 temperature::float:32 humidity::uint:32`

