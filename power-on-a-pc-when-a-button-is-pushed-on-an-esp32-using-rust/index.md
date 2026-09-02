# Power on a PC when a button is pushed on an ESP32 using Rust

- Canonical URL: https://leandeep.com/power-on-a-pc-when-a-button-is-pushed-on-an-esp32-using-rust/
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
esp-idf-hal = "0.45.2"
```

<br/>

## Code

Now update `main.rs` and add this code:

```

use core::convert::TryInto;
use embedded_svc::wifi::{AuthMethod, ClientConfiguration, Configuration};

//use esp_idf_svc::hal::prelude::Peripherals;
use esp_idf_svc::log::EspLogger;
use esp_idf_svc::wifi::{BlockingWifi, EspWifi};
use esp_idf_svc::{eventloop::EspSystemEventLoop, nvs::EspDefaultNvsPartition};

use log::info;
use std::net::{UdpSocket, Ipv4Addr, SocketAddrV4};
use std::time::Duration;
use esp_idf_hal::delay::FreeRtos;
use esp_idf_hal::gpio::PinDriver;
use esp_idf_hal::peripherals::Peripherals;

const SSID: &str = "...";
const PASSWORD: &str = "...";

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
    
    //let peripherals = Peripherals::take().unwrap();
    let pins = peripherals.pins;

    let mut led = PinDriver::output(pins.gpio2).unwrap();
    let button = PinDriver::input(pins.gpio35).unwrap();
    let mac: [u8; 6] = [0x94, 0xC6, 0x91, 0xAD, 0x1D, 0x49];
    loop {
        if button.is_high() {
            log::info!("Switch ON");
            led.set_high().unwrap(); // Switch ON LED
            send_wol(&mac);
            
        } else {
            log::info!("Switch OFF");
            led.set_low().unwrap();  // Switch OFF LED
        }
        FreeRtos::delay_ms(1000u32);
    }
    
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
    send_wol(&mac);
    
    Ok(())
}

fn send_wol(mac: &[u8; 6]) {
    info!("Sending WOL request on the LAN");
    let mut packet: Vec<u8> = vec![0xFF; 6]; // 6 octets at 0xFF
    packet.extend_from_slice(&mac.repeat(16)); // repeat the MAC address 16 times
    let socket = UdpSocket::bind("0.0.0.0:0").expect("Impossible to bind socket");
    socket.set_read_timeout(Some(Duration::from_secs(2))).unwrap();
    let addr = SocketAddrV4::new(Ipv4Addr::new(255, 255, 255, 255), 9);
    socket
        .send_to(&packet, addr)
        .expect("Failed sending WOL packet");

    info!("Wake-on-LAN sent to MAC: {:02x}:{:02x}:{:02x}:{:02x}:{:02x}:{:02x}", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);

}

```

<br/>


## Build and Run
```
cargo build
espflash flash target/xtensa-esp32-espidf/debug/blink --monitor
```

