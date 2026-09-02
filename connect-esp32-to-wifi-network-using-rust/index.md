# Connect ESP32 to wifi network using Rust

- Canonical URL: https://leandeep.com/connect-esp32-to-wifi-network-using-rust/
- Author: Olivier Eeckhoutte
- Published: 2025-03-28T15:49:00+02:00
- Updated: 2025-03-28T15:49:00+02:00
- Language: fr
- Tags: Rust, ESP32
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



<br/>

## Prerequisites

```
[dependencies]
log = "0.4"
anyhow = "1"
embedded-svc = { version = "0.28", default-features = false }
esp-idf-svc = { version = "0.51", features = ["critical-section", "embassy-time-driver", "embassy-sync"] }
```

<br/>

## Code

Now update `main.rs` and add this code:

```
use core::convert::TryInto;
use embedded_svc::wifi::{AuthMethod, ClientConfiguration, Configuration};

use esp_idf_svc::hal::prelude::Peripherals;
use esp_idf_svc::log::EspLogger;
use esp_idf_svc::wifi::{BlockingWifi, EspWifi};
use esp_idf_svc::{eventloop::EspSystemEventLoop, nvs::EspDefaultNvsPartition};

use log::info;

const SSID: &str = "SSID";
const PASSWORD: &str = "password";

fn main() -> anyhow::Result<()> {
    esp_idf_svc::sys::link_patches();
    EspLogger::initialize_default();

    let peripherals = Peripherals::take()?;
    let sys_loop = EspSystemEventLoop::take()?;
    let nvs = EspDefaultNvsPartition::take()?;

    let mut wifi = BlockingWifi::wrap(
        EspWifi::new(peripherals.modem, sys_loop.clone(), Some(nvs))?,
        sys_loop,
    )?;

    connect_wifi(&mut wifi)?;

    let ip_info = wifi.wifi().sta_netif().get_ip_info()?;

    info!("Wifi DHCP info: {:?}", ip_info);

    info!("Shutting down in 5s...");

    std::thread::sleep(core::time::Duration::from_secs(5));

    Ok(())
}

fn connect_wifi(wifi: &mut BlockingWifi<EspWifi<'static>>) -> anyhow::Result<()> {
    let wifi_configuration: Configuration = Configuration::Client(ClientConfiguration {
        ssid: SSID.try_into().unwrap(),
        bssid: None,
        auth_method: AuthMethod::WPA2Personal,
        password: PASSWORD.try_into().unwrap(),
        channel: None,
        ..Default::default()
    });

    wifi.set_configuration(&wifi_configuration)?;

    wifi.start()?;
    info!("Wifi started");

    wifi.connect()?;
    info!("Wifi connected");

    wifi.wait_netif_up()?;
    info!("Wifi netif up");

    Ok(())
}

```

<br/>


## Build and Run
```
cargo build
espflash flash target/xtensa-esp32-espidf/debug/blink --monitor
```

