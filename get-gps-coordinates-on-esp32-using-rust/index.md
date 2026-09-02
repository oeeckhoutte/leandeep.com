# Get GPS coordinates on ESP32 using Rust

- Canonical URL: https://leandeep.com/get-gps-coordinates-on-esp32-using-rust/
- Author: Olivier Eeckhoutte
- Published: 2025-04-02T20:49:00+02:00
- Updated: 2025-04-02T20:49:00+02:00
- Language: fr
- Tags: GPS, ESP32, Rust
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this article we are going to see how to retrieve NMEA sentences from a GPS module NEO-6M connected to an ESP32.


<br/>
Connect the NEO-6M GPS module to the ESP32
<br/>

![image](/images/esp-gps.jpg)

<br/>

> Dependencies:
> ```
> esp-idf-svc = { version = "0.51", features = ["critical-section", "embassy-time-driver", "embassy-sync"] }
> esp-idf-hal = "0.45.2"
> ```

<br/>

```
use esp_idf_hal::peripherals::Peripherals;
use esp_idf_hal::prelude::*;
use esp_idf_hal::uart::*;
use esp_idf_svc::hal::uart::config::DataBits;
use esp_idf_svc::hal::uart::config::StopBits;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Lien des patches ESP-IDF
    esp_idf_svc::sys::link_patches();
    
    // Configuration du logger
    esp_idf_svc::log::EspLogger::initialize_default();
    log::info!("Démarrage de l'application GPS");

    // Initialisation des périphériques
    let peripherals = Peripherals::take().unwrap();
    
    // Configuration de l'UART
    let config = config::Config::default()
        .baudrate(Hertz(9600))
        .data_bits(DataBits::DataBits8)
        .parity_none()
        .stop_bits(StopBits::STOP1);

    // Création du driver UART avec typage explicite
    let mut uart_driver = UartDriver::new(
        peripherals.uart2,
        peripherals.pins.gpio17, // TX
        peripherals.pins.gpio16, // RX
        Option::<esp_idf_hal::gpio::Gpio0>::None, // RTS (pas utilisé)
        Option::<esp_idf_hal::gpio::Gpio0>::None, // CTS (pas utilisé)
        &config,
    )?;

    println!("UART initialisé avec un débit de 9600 bauds");

    // Buffer pour stocker les données GPS
    let mut buffer = [0u8; 128];
    
    loop {
        // Lecture des données disponibles sur l'UART avec timeout
        match uart_driver.read(&mut buffer, 1000) {
            Ok(bytes_read) if bytes_read > 0 => {
                let gps_data = &buffer[..bytes_read];
                println!(
                    "Données GPS reçues : {}",
                    String::from_utf8_lossy(gps_data)
                );
            },
            Ok(_) => {
                println!("Aucune donnée GPS reçue (timeout)");
            },
            Err(e) => {
                println!("Erreur de lecture UART: {:?}", e);
            }
        }

        println!("-------------------------------");
        std::thread::sleep(std::time::Duration::from_secs(1));
    }
}
```
