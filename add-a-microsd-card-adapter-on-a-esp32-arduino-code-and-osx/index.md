# Add a MicroSD card adapter on a ESP32 (Arduino code and OSX)

- Canonical URL: https://leandeep.com/add-a-microsd-card-adapter-on-a-esp32-arduino-code-and-osx/
- Author: Olivier Eeckhoutte
- Published: 2025-04-11T22:49:00+02:00
- Updated: 2025-04-11T22:49:00+02:00
- Language: fr
- Tags: ESP32
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



<br/>

## Prerequisites

- Arduino IDE installed
- `arduino-cli` installed on OSX (using `brew install arduino-cli`) to ease monitoring via the command `arduino-cli monitor -p /dev/ttyUSB0 -c baudrate=115200`
- Determine ESP32 SPI GPIO Pins. To do that you can the following code:
```
void setup() {
  Serial.begin(115200);

  Serial.print("MOSI: ");
  Serial.println(MOSI); // MOSI Pin by default
  Serial.print("MISO: ");
  Serial.println(MISO); // MISO Pin by default
  Serial.print("SCK: ");
  Serial.println(SCK); // SCK Pin by default
  Serial.print("CS: ");
  Serial.println(SS); // CS Pin by default
}

void loop() {
}
```
- Install `SD` library from Arduino IDE
- I connected VCC to 5V, GND to GND, MISO to pin 19, MOSI to pin 23, SCK to pin 18 and CS to pin 5.

<br/>

## Arduino Code

```
#include <FS.h>
#include <SD.h>
#include <SPI.h>

void setup() {
  Serial.begin(115200);

  // Init SD card
  if (!SD.begin(5)) { // GPIO 5 is used for CS
    Serial.println("Could not mount SD card");
    return;
  }

  Serial.println("SD card successfully mounted");

  // Display SD card informations
  uint64_t cardSize = SD.cardSize() / (1024 * 1024);
  Serial.printf("SD card size: %llu MB\n", cardSize);

  // Create example file
  writeFile(SD, "/example.txt", "This is an example file.");
  
  // Read and display the files in the root dir
  listDir(SD, "/", 0);
}

void loop() {
  // Nothing to do
}

// Function to list files in a directory
void listDir(fs::FS &fs, const char * dirname, uint8_t levels) {
  Serial.printf("Directory listing: %s\n", dirname);

  File root = fs.open(dirname);
  if (!root || !root.isDirectory()) {
    Serial.println("Could not open directory Or it is not a directory");
    return;
  }

  File file = root.openNextFile();
  while (file) {
    if (file.isDirectory()) {
      Serial.print("DIR : ");
      Serial.println(file.name());
      if (levels) {
        listDir(fs, file.name(), levels - 1);
      }
    } else {
      Serial.print("FICHIER : ");
      Serial.print(file.name());
      Serial.print(" TAILLE : ");
      Serial.println(file.size());
    }
    file = root.openNextFile();
  }
}

// Function to write a file
void writeFile(fs::FS &fs, const char * path, const char * message) {
  Serial.printf("Writing in file: %s\n", path);

  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    Serial.println("Could not open file to write into it");
    return;
  }

  if (file.print(message)) {
    Serial.println("File successfully written");
  } else {
    Serial.println("Impossible to write file");
  }

  file.close();
}
```

<br/>

In a next article we will see how to do the same thing with Rust.
