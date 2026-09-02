# Fixer l'écran noir de Kali avec UTM

- Canonical URL: https://leandeep.com/fixer-l%C3%A9cran-noir-de-kali-avec-utm/
- Author: Olivier Eeckhoutte
- Published: 2024-01-12T07:00:00+02:00
- Updated: 2024-01-12T07:00:00+02:00
- Language: fr
- Tags: Linux, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


UTM sur OSX est un hyperviseur gratuit permettant d'installer différentes VMs. Je l'utilise par exemple pour utiliser Windows ARM et Kali ARM.

Lorsqu'on installe Kali depuis la librairie de VMs disponibles et qu'on le démarre pour la première fois on a un écran noir.

Pour le fixer, il suffit d'aller dans les settings de la VM et de changer l'emulated display card. Sélectionner `virtio-ramfb`.

![image](/images/kali-utm.png)

> Pensez à configurer la carte réseau en bridge.
> Et pensez à installer ssh et activer le service `sudo service ssh enable && sudo service ssh start`.
> Pensez à sélectionner l'option permettant de faire du USB passthrough et configurer les USB ports en USB 3.0. Pour vérifier que les USB arrivent bien à se connecter sur Kali, utiliser la commande `lsusb`.


Voilà c'est tout pour le tip.


