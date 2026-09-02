# Install Kali Nethunter on Android 14 [Rootless procedure]

- Canonical URL: https://leandeep.com/install-kali-nethunter-on-android-14-rootless-procedure/
- Author: Olivier Eeckhoutte
- Published: 2024-03-24T06:34:00Z
- Updated: 2024-03-24T06:34:00Z
- Language: fr
- Tags: Android, Kali
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

(Between 2 baby's bottles) I am going to explain how to install Kali Nethunter on an Android phone not rooted. The procedure is quite simple. Without further ado let's see how to do it.

<br/>

## Prerequisites

- Android 13+
- Termux installed
- Android developer mode enabled

<br/>

## Installation

On termux execute the following commands:

```
pkg update -y
termux-setup-storage
pkg install wget
wget -O install-nethunter-termux https://offsec.ec/2MceZWr
chmod +x install-nethunter-termux
./install-nethunter-termux
```

Then on the installation page KALI select option 1 to have a full installation.

Then for the question "Delete downloaded rootfs file" -> Select "no".

<br/>
## Kix dbus error

Fix the DNS server by editing the /etc/resolv.conf file. Change the local IP (or 9.9.9.9) by Google's DNS IP or use another DNS service provider. So set `nameserver 8.8.8.8`
Then run `apt update`
And install the package `apt install dbus-x11`

Finally open the settings of your Android phone and go to developer options. Enable `Disable child process restrictions`.

<br/>

## Kali NetHunter Desktop Experience (KeX) installation

Go back to Termux. Exit your current session if you already ran `nh -r` and run the command `nh kex`.

Now download Kali nethunter app store. To do so go to https://store.nethunter.com/en and click the download button. Install the APK using the package manager and open the store F-Droid. From there search `nethunter kex` using the magnifier and install Nethunter keX bVNC.

<br/>

## Load KeX from Android

Open Nethunter Kex using the newly created icon and create a new connection.
Let localhost as host and 5900 as port and set your password.
On the small screen of my Pixel Kali's GUI is not very usable but apparently it is possible to output the screen to an external cable using a OTG cable or a USB cable directly.

> To stop kex you will need to open a new session in Termux and execute the command `nh kex stop`.
