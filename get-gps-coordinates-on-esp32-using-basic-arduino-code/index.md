# Get GPS coordinates on ESP32 using basic Arduino code

- Canonical URL: https://leandeep.com/get-gps-coordinates-on-esp32-using-basic-arduino-code/
- Author: Olivier Eeckhoutte
- Published: 2025-04-02T20:49:00+02:00
- Updated: 2025-04-02T20:49:00+02:00
- Language: fr
- Tags: GPS, ESP32, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this article we are going to see how to retrieve NMEA sentences from a GPS module NEO-6M connected to an ESP32.


<br/>
Connect the NEO-6M GPS module to the ESP32
<br/>
Then create an Arduino program and deploy it to the ESP-wroom-32.

```
arduino-cli sketch new arduino-gps
cd arduino-gps/
```

<br/>
Edit the arduino-gps.ino file and add the following content:

```
#define RXD2 16
#define TXD2 17

#define GPS_BAUD 9600

// Create an instance of the HardwareSerial class for Serial 2
HardwareSerial gpsSerial(2);

void setup(){
  // Serial Monitor
  Serial.begin(115200);

  // Start Serial 2 with the defined RX and TX pins and a baud rate of 9600
  gpsSerial.begin(GPS_BAUD, SERIAL_8N1, RXD2, TXD2);
  Serial.println("Serial 2 started at 9600 baud rate");
}

void loop(){
  while (gpsSerial.available() > 0){
    // get the byte data from the GPS
    char gpsData = gpsSerial.read();
    Serial.print(gpsData);
  }
  delay(1000);
  Serial.println("-------------------------------");
}
```

<br/>
Compile and deploy:

```
arduino-cli compile --fqbn esp32:esp32:esp32 arduino-gps.ino
arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 arduino-gps.ino
arduino-cli monitor -p /dev/ttyUSB0 -c baudrate=115200
```


<br/>

Put the GPS module outside your house and once it starts to blink it means he starts to get a precise position.

> The important line is the one that starts with `$GPGGA`. Ask chatgpt to explain you how it's structure. It's very simple and you have all kinds of information.

