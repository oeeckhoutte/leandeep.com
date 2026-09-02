# Lister les devices Wifi autour de votre Mac

- Canonical URL: https://leandeep.com/lister-les-devices-wifi-autour-de-votre-mac/
- Author: Olivier Eeckhoutte
- Published: 2021-08-14T07:25:00Z
- Updated: 2021-08-14T07:25:00Z
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Sans rien installer sur votre OSX, voici la commande pour lister les devices Wifi autour de vous via cli.
Les informations suivantes seront disponibles: SSID, BSSID, RSSI, CHANNEL, HT, CC, SECURITY

```
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s

# Pour se simplifier la vie
# sudo ln -s /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/sbin/airport
# airport -s
```
