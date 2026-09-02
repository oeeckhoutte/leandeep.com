# Get ESP32 cores count and use multithreading in Rust

- Canonical URL: https://leandeep.com/get-esp32-cores-count-and-use-multithreading-in-rust/
- Author: Olivier Eeckhoutte
- Published: 2025-04-08T22:49:00+02:00
- Updated: 2025-04-08T22:49:00+02:00
- Language: fr
- Tags: Rust, ESP32
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



<br/>

## Prerequisites

```
[dependencies]
log = "0.4"
anyhow = "1.0"
esp-idf-hal = "0.45.2"
esp-idf-svc = { version = "0.51", features = ["critical-section", "embassy-time-driver", "embassy-sync"] }
```

<br/>

## Count cores code

Now update `main.rs` and add this code:

```
use esp_idf_hal::cpu;
use esp_idf_svc::log::EspLogger;

fn main() -> anyhow::Result<()> {
    EspLogger::initialize_default();
    log::info!("Starting program...");

    let cpu_cores = cpu::CORES;
    log::info!("Cores count : {}", cpu_cores);

    Ok(())
}
```

<br/>


## Build and Run
```
cargo generate --git https://github.com/esp-rs/esp-idf-template cargo
cd core
source ~/export-esp.sh
cargo build
espflash flash target/xtensa-esp32-espidf/debug/core --monitor
```

<br/>

## Execute code in different threads code

```
use core::time::Duration;
use std::thread;
fn main() {
    esp_idf_svc::log::EspLogger::initialize_default();
    log::info!("Starting multi-threaded example on ESP32");

    // Spawn thread 1 on Core 0
    thread::spawn(|| {
        loop {
            log::info!("Task running on Core 0");
            thread::sleep(Duration::from_secs(2)); // Simulate work
        }
    });

    // Spawn thread 2 on Core 1
    thread::spawn(|| {
        loop {
            log::info!("Task running on Core 1");
            thread::sleep(Duration::from_secs(4)); // Simulate work
        }
    });

    // Keep the main thread alive
    loop {
        thread::sleep(Duration::from_secs(10));
    }
}
```


<br/>

## Execute code in different threads and share variable

```
use core::time::Duration;
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Initialisation du logger
    esp_idf_svc::log::EspLogger::initialize_default();
    log::info!("Starting program");

    // Shared variable between threads
    let shared_counter = Arc::new(Mutex::new(0));

    // Spawn thread 1 on Core 0
    let counter_thread_1 = Arc::clone(&shared_counter);
    thread::spawn(move || {
        loop {
            {
                let mut counter = counter_thread_1.lock().unwrap();
                *counter += 1;
                log::info!("Core 0 incremented counter to {}", *counter);
            }
            thread::sleep(Duration::from_secs(2)); // Simule du travail
        }
    });

    // Spawn thread 2 on Core 1
    let counter_thread_2 = Arc::clone(&shared_counter);
    thread::spawn(move || {
        loop {
            {
                let mut counter = counter_thread_2.lock().unwrap();
                *counter += 2;
                log::info!("Core 1 incremented counter to {}", *counter);
            }
            thread::sleep(Duration::from_secs(4)); // Simule du travail
        }
    });

    // Main Thread: read shared variable value
    loop {
        {
            let counter = shared_counter.lock().unwrap();
            log::info!("Main thread reads counter: {}", *counter);
        }
        thread::sleep(Duration::from_secs(5));
    }
}
```


