# Scan Wifi networks on ESP32 using Rust

- Canonical URL: https://leandeep.com/scan-wifi-networks-on-esp32-using-rust/
- Author: Olivier Eeckhoutte
- Published: 2025-04-08T20:49:00+02:00
- Updated: 2025-04-08T20:49:00+02:00
- Language: fr
- Tags: ESP32, Rust
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this article we are going to see how to scan Wifi networks around you.



<br/>

The crates used are the following ones:

```
[dependencies]
log = "0.4"
esp-idf-svc = { version = "0.51", features = ["critical-section", "embassy-time-driver", "embassy-sync"] }
esp-idf-hal = "0.45.2"
```

<br/>

```
use esp_idf_hal::prelude::*;
use esp_idf_svc::eventloop::EspSystemEventLoop;
use esp_idf_svc::nvs::EspDefaultNvsPartition;
use esp_idf_svc::sys::EspError;
use esp_idf_svc::wifi::{AuthMethod, BlockingWifi, ClientConfiguration, Configuration, EspWifi};
use std::thread;
use std::time::Duration;

fn main() -> Result<(), EspError> {
    esp_idf_svc::sys::link_patches();
    esp_idf_svc::log::EspLogger::initialize_default();
    log::set_max_level(log::LevelFilter::Info);
    log::info!("Program started!");

    // Init needed components
    let peripherals = Peripherals::take().unwrap();
    let nvs = EspDefaultNvsPartition::take()?;
    let sys_loop = EspSystemEventLoop::take()?;

    // Init WiFi
    let esp_wifi = EspWifi::new(peripherals.modem, sys_loop.clone(), Some(nvs))?;
    let mut wifi = BlockingWifi::wrap(esp_wifi, sys_loop)?;

    let wifi_config = Configuration::Client(ClientConfiguration::default());
    wifi.set_configuration(&wifi_config)?;

    wifi.start()?;
    println!("WiFi started in station mode");
    thread::sleep(Duration::from_secs(2));

    // Boucle infinie pour scanner les réseaux
    loop {
        println!("\n=== Scanning WiFi networks... ===");

        match wifi.scan() {
            Ok(scan_result) => {
                println!("{} WiFi networks detected:", scan_result.len());

                // Sort networks per signal power (stronger first)
                let mut networks = scan_result;
                networks.sort_by(|a, b| b.signal_strength.cmp(&a.signal_strength));

                for (i, ap) in networks.iter().enumerate() {
                    // Convert SSID to String
                    let ssid = if ap.ssid.is_empty() {
                        "<Hidden network>".to_string()
                    } else {
                        ap.ssid.to_string()
                    };

                    // Format BSSID to MAC address
                    let mac = format!(
                        "{:02X}:{:02X}:{:02X}:{:02X}:{:02X}:{:02X}",
                        ap.bssid[0],
                        ap.bssid[1],
                        ap.bssid[2],
                        ap.bssid[3],
                        ap.bssid[4],
                        ap.bssid[5]
                    );

                    println!(
                        "{:2}. SSID: {:32} | Signal: {:4} dBm | Channel: {:2} | MAC: {:17} | Security: {:?}",
                        i + 1,
                        ssid,
                        ap.signal_strength,
                        ap.channel,
                        mac,
                        auth_method_to_string(ap.auth_method)
                    );
                }
            }
            Err(e) => {
                println!("Error while scanning: {:?}", e);
            }
        }

        println!("Wait 5 seconds before next scan...");
        thread::sleep(Duration::from_secs(5));
    }
}

fn auth_method_to_string(auth: Option<AuthMethod>) -> &'static str {
    match auth {
        Some(AuthMethod::None) => "Open",
        Some(AuthMethod::WEP) => "WEP",
        Some(AuthMethod::WPA) => "WPA",
        Some(AuthMethod::WPA2Personal) => "WPA2-Personal",
        Some(AuthMethod::WPA3Personal) => "WPA3-Personal",
        Some(AuthMethod::WPA2Enterprise) => "WPA2-Enterprise",
        Some(AuthMethod::WPA2WPA3Personal) => "WPA2/WPA3",
        None => "Unknown",
        _ => "Unknown",
    }
}
```

