# Make onboard LED blink using Rust on ESP32

- Canonical URL: https://leandeep.com/make-onboard-led-blink-using-rust-on-esp32/
- Author: Olivier Eeckhoutte
- Published: 2025-03-28T11:49:00+02:00
- Updated: 2025-03-28T11:49:00+02:00
- Language: fr
- Tags: Rust, ESP32
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



AI tools are awesome. Lately, I've been wondering if they could replace us developers, but actually no it's impossible because you always have issues. However, it's crazy how much they boost my productivity. I now do my research directly on LLMs and get answers much faster than if I had searched on Google myself. It's fantastic!

In this new article, we will explore how to make an onboard LED blink on an ESP32 using Rust.

<br/>

## Project initialization

```
cargo generate --git https://github.com/esp-rs/esp-idf-template cargo
cd blink
source ~/export-esp.sh
cargo build
espflash flash target/xtensa-esp32-espidf/debug/blink --monitor
```

<br/>

## Update template code

**Install Rust crate**
```
cargo add esp-idf-hal
```

<br/>

`Cargo.toml` looks like this:

```
[package]
name = "blink"
version = "0.1.0"
authors = ["olivier"]
edition = "2021"
resolver = "2"
rust-version = "1.77"

[[bin]]
name = "blink"
harness = false # do not use the built in cargo test harness -> resolve rust-analyzer errors

[profile.release]
opt-level = "s"

[profile.dev]
debug = true    # Symbols are nice and they don't increase the size on Flash
opt-level = "z"

[features]
default = []

experimental = ["esp-idf-svc/experimental"]

[dependencies]
log = "0.4"
esp-idf-svc = { version = "0.51", features = ["critical-section", "embassy-time-driver", "embassy-sync"] }
esp-idf-hal = "0.45.2"

[build-dependencies]
embuild = "0.33"

```

<br/>

Now update `main.rs` and add this code:

```
use esp_idf_hal::gpio::PinDriver;
use esp_idf_hal::peripherals::Peripherals;
use esp_idf_hal::delay::FreeRtos;

fn main() -> ! {

    let peripherals = Peripherals::take().unwrap();
    let pins = peripherals.pins;
    let mut led = PinDriver::output(pins.gpio2).unwrap();
    loop {
        FreeRtos::delay_ms(50u32);
        led.set_high().unwrap(); // Switch ON
        FreeRtos::delay_ms(50u32);
        led.set_low().unwrap();  // Switch OFF
    }
}
```

<br/>


**Build and Run**
```
cargo build
espflash flash target/xtensa-esp32-espidf/debug/blink --monitor
```

