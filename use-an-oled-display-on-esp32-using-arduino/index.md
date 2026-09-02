# Use an Oled display on ESP32 using Arduino

- Canonical URL: https://leandeep.com/use-an-oled-display-on-esp32-using-arduino/
- Author: Olivier Eeckhoutte
- Published: 2025-04-17T22:49:00+02:00
- Updated: 2025-04-17T22:49:00+02:00
- Language: fr
- Tags: Arduino, ESP32
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this article we are going to see how to connect and display some content on an Oled display connected via I2C on an ESP-Wroom-32. The code is written in Arduino code.

<br/>

## Prerequisites

Install Arduino libraries:
- Adafruit SSD1306
- Adafruit GFX Library

<br/>

Connect the Oled display to the ESP32 board:

Voici le branchement I2C entre ton ESP32 et l’écran :

It is an OLED (NFP1315-61AY)
- Connect VCC to 3.3V
- Of course connect GND to GND
- Connect SCL to GPIO22
- Connect SDA to GPIO21

<br/>


## Code

```
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// default I2C Adress is often 0x3C
#define OLED_ADDR 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup() {
  Wire.begin(21, 22); // SDA, SCL
  display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);
  display.clearDisplay();

  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0,0);
  display.println("Hello Olivier!");
  display.display();
}

void loop() {
}

```

<br/>

## Troubleshooting

To find the Oled display address:

```
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(115200);
  while (!Serial);
  Serial.println("\nI2C Scanner");
  for (uint8_t i = 1; i < 127; ++i) {
    Wire.beginTransmission(i);
    if (Wire.endTransmission() == 0) {
      Serial.print("I2C device found at 0x");
      Serial.println(i, HEX);
      delay(10);
    }
  }
  Serial.println("Done.");
}

void loop() {}
```

<br/>

In a next article we are going to see how to do the same in Rust.

