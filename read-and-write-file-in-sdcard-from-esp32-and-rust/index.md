# Read and write file in sdcard from ESP32 and Rust

- Canonical URL: https://leandeep.com/read-and-write-file-in-sdcard-from-esp32-and-rust/
- Author: Olivier Eeckhoutte
- Published: 2025-04-13T22:49:00+02:00
- Updated: 2025-04-13T22:49:00+02:00
- Language: fr
- Tags: Rust, ESP32
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this article we are going to see how to read a file from a SD Card in Rust using the SPI port of the ESP32.

<br/>

## Prerequisites

```
cargo install esp-generate@0.3.1
esp-generate --chip esp32 sd
source ~/export-esp.sh
cargo build
# espflash flash target/xtensa-esp32-none-elf/debug/sd --monitor
```

<br/>

## Dependencies

```
[dependencies]
critical-section = "1.2.0"
embassy-executor = { version = "0.7.0", features = ["task-arena-size-20480"] }
embassy-time     = { version = "0.4.0", features = ["generic-queue-8"] }
esp-hal          = { version = "1.0.0-beta.0", features = ["esp32", "unstable"] }
esp-hal-embassy  = { version = "0.7.0", features = ["esp32"] }
static_cell      = { version = "2.1.0", features = ["nightly"] }
# sd card driver
embedded-sdmmc = "0.8.1"
# To convert Spi bus to SpiDevice
embedded-hal-bus = "0.3.0"
## For time parsing
chrono = { version = "0.4.40", default-features = false }
esp-println = { version = "0.12.0", features = ["esp32", "log"] }
```

<br/>

## Code

```
//cargo install esp-generate@0.3.1
//esp-generate --chip esp32 sd
//source ~/export-esp.sh
//cargo build
//espflash flash target/xtensa-esp32-none-elf/debug/sd --monitor

#![no_std]
#![no_main]

use embassy_executor::Spawner;
use embassy_time::{Delay, Duration, Timer};
use embedded_hal_bus::spi::ExclusiveDevice;
use embedded_sdmmc::{SdCard, TimeSource, Timestamp, VolumeIdx, VolumeManager};
use esp_hal::clock::CpuClock;
use esp_hal::gpio::{Level, Output, OutputConfig};
use esp_hal::spi;
use esp_hal::spi::master::Spi;
use esp_hal::time::Rate;
use esp_hal::timer::timg::TimerGroup;
use esp_println::{self as _, print, println};

#[panic_handler]
fn panic(_: &core::panic::PanicInfo) -> ! {
    loop {}
}

/// Code from https://github.com/rp-rs/rp-hal-boards/blob/main/boards/rp-pico/examples/pico_spi_sd_card.rs
/// A dummy timesource, which is mostly important for creating files.
#[derive(Default)]
pub struct DummyTimesource();

impl TimeSource for DummyTimesource {
    // In theory you could use the RTC of the rp2040 here, if you had
    // any external time synchronizing device.
    fn get_timestamp(&self) -> Timestamp {
        Timestamp {
            year_since_1970: 0,
            zero_indexed_month: 0,
            zero_indexed_day: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        }
    }
}

#[esp_hal_embassy::main]
async fn main(_spawner: Spawner) {
    let config = esp_hal::Config::default().with_cpu_clock(CpuClock::max());
    let peripherals = esp_hal::init(config);

    let timer0 = TimerGroup::new(peripherals.TIMG1);
    esp_hal_embassy::init(timer0.timer0);

    println!("Embassy initialized!");

    let spi_bus = Spi::new(
        peripherals.SPI2,
        spi::master::Config::default()
            .with_frequency(Rate::from_khz(400))
            .with_mode(spi::Mode::_0),
    )
    .unwrap()
    .with_sck(peripherals.GPIO18)
    .with_mosi(peripherals.GPIO23)
    .with_miso(peripherals.GPIO19)
    .into_async();
    let sd_cs = Output::new(peripherals.GPIO5, Level::High, OutputConfig::default());
    let spi_dev = ExclusiveDevice::new(spi_bus, sd_cs, Delay).unwrap();

    let sdcard = SdCard::new(spi_dev, Delay);
    let mut volume_mgr = VolumeManager::new(sdcard, DummyTimesource::default());

    println!("Init SD card controller and retrieve card size...");
    let sd_size = volume_mgr.device().num_bytes().unwrap();
    println!("SD card size is {} bytes\r\n", sd_size);

    let mut volume0 = volume_mgr.open_volume(VolumeIdx(0)).unwrap();
    let mut root_dir = volume0.open_root_dir().unwrap();
    {
        let mut my_file = root_dir
            .open_file_in_dir(
                "example.txt",
                embedded_sdmmc::Mode::ReadWriteCreateOrTruncate,
            )
            .unwrap();

        let line = "Hello Rust!";
        if let Ok(()) = my_file.write(line.as_bytes()) {
            my_file.flush().unwrap();
            println!("Written Data");
        } else {
            println!("Not written");
        }
    }
    {
        let mut my_file = root_dir
            .open_file_in_dir("example.txt", embedded_sdmmc::Mode::ReadOnly)
            .unwrap();

        while !my_file.is_eof() {
            let mut buffer = [0u8; 32];

            if let Ok(n) = my_file.read(&mut buffer) {
                for b in &buffer[..n] {
                    print!("{}", *b as char);
                }
            }
        }
    }

    loop {
        Timer::after(Duration::from_secs(30)).await;
    }
}

```

