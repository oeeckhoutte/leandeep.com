# Run Rust code on ESP32

- Canonical URL: https://leandeep.com/run-rust-code-on-esp32/
- Author: Olivier Eeckhoutte
- Published: 2025-03-24T22:49:00+02:00
- Updated: 2025-03-24T22:49:00+02:00
- Language: fr
- Tags: ESP32, Rust, ESP, IoT
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this brief article, we will explore how to set up the ESP32 development environment to build and run Rust code on the ESP-WROOM-32. This procedure is written to work on Ubuntu 22 with a 64-bit Intel processor. The ESP32 is connected to the PC via USB.

<br/>

## Installation

**Install Ubuntu packages**
```
sudo apt install -y build-essential libssl-dev pkg-config git
sudo apt install -y python3-pip python3-venv
```

<br/>

**Configure USB permissions**
```
sudo usermod -aG dialout $USER
sudo usermod -aG tty $USER
# Restart the session
```

<br/>

**Install Rust**
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

<br/>

**Install espup for Xtensa (ESP-WROOM-32 architecture)**
```
cargo install espup
espup install
source ~/export-esp.sh
```

<br/>

**Additional tools**
```
cargo install cargo-generate espflash cargo-espflash ldproxy
```

<br/>

## Create a package, build and deploy
```
cargo generate --git https://github.com/esp-rs/esp-idf-template cargo
cd esp32-project
```

<br/>

**Build**
```
source ~/export-esp.sh
cargo build
```

<br/>

**Flash on ESP32**
```
espflash flash target/xtensa-esp32-espidf/debug/esp32-project --monitor
```

<br/>

## Troubleshooting

```
sudo apt install libudev-dev libusb-1.0-0-dev
```

<br/>
**Check permissions**
```
ls -l /dev/ttyUSB0  # Must belong to 'dialout' group
# sudo usermod -a -G dialout $USER
# sudo chown $USER /dev/ttyUSB0
```

<br/>

**Check espflash version**
```
espflash --version  # Requires v2.0+
```

<br/>

**Verify communication with ESP**
```
espflash board-info
```

