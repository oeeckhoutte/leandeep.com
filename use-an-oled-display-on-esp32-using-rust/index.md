# Use an Oled display on ESP32 using Rust

- Canonical URL: https://leandeep.com/use-an-oled-display-on-esp32-using-rust/
- Author: Olivier Eeckhoutte
- Published: 2025-04-17T22:49:00+02:00
- Updated: 2025-04-17T22:49:00+02:00
- Language: fr
- Tags: Rust, ESP32
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this article we are going to see how to connect and display some content on an Oled display connected via I2C on an ESP-Wroom-32. The code is written in Rust.

<br/>

## Prerequisites

Connect the Oled display to the ESP32 board:

Voici le branchement I2C entre ton ESP32 et l’écran :

It is an OLED (NFP1315-61AY)
- Connect VCC to 3.3V
- Of course connect GND to GND
- Connect SCL to GPIO22
- Connect SDA to GPIO21

<br/>

## Dependencies

```
[dependencies]
log = "0.4"
anyhow = "1.0"
esp-idf-hal = "0.45.2"
esp-idf-svc = { version = "0.51", features = ["critical-section", "embassy-time-driver", "embassy-sync"] }

embedded-hal = "1.0.0"
embedded-graphics = "0.8.1"
ssd1306 = "0.10.0"
```

<br/>


## Code

```
use anyhow::anyhow;
use esp_idf_hal::i2c::{I2cConfig, I2cDriver};
use esp_idf_hal::peripherals::Peripherals;
use esp_idf_hal::prelude::*;
use std::{thread, time::Duration}; // for .kHz()

use embedded_graphics::{
    mono_font::{ascii::FONT_6X10, MonoTextStyle},
    pixelcolor::BinaryColor,
    prelude::*,
    text::Text,
};

use ssd1306::{prelude::*, I2CDisplayInterface, Ssd1306};

fn main() -> anyhow::Result<()> {
    let peripherals = Peripherals::take().unwrap();
    let i2c = peripherals.i2c0;
    let sda = peripherals.pins.gpio21;
    let scl = peripherals.pins.gpio22;

    let config = I2cConfig::new().baudrate(400u32.kHz().into());
    let i2c_driver =
        I2cDriver::new(i2c, sda, scl, &config).map_err(|e| anyhow!("I2C init error: {:?}", e))?;

    let interface = I2CDisplayInterface::new(i2c_driver);
    let mut display = Ssd1306::new(interface, DisplaySize128x64, DisplayRotation::Rotate0)
        .into_buffered_graphics_mode();

    display
        .init()
        .map_err(|e| anyhow!("Display init error: {:?}", e))?;
    display
        .flush()
        .map_err(|e| anyhow!("Flush error: {:?}", e))?;

    let style = MonoTextStyle::new(&FONT_6X10, BinaryColor::On);
    Text::new("Hello Olivier !!!", Point::new(10, 32), style)
        .draw(&mut display)
        .map_err(|e| anyhow!("Draw error: {:?}", e))?;

    display
        .flush()
        .map_err(|e| anyhow!("Final flush error: {:?}", e))?;

    loop {
        thread::sleep(Duration::from_millis(1000));
    }
}

```


<br/>


## Build

```
# cargo generate --git https://github.com/esp-rs/esp-idf-template cargo
source ~/export-esp.sh
cargo build
espflash flash target/xtensa-esp32-espidf/debug/oled --monitor
```

