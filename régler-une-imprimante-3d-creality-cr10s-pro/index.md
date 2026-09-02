# Régler une imprimante 3D Creality cr10s pro

- Canonical URL: https://leandeep.com/r%C3%A9gler-une-imprimante-3d-creality-cr10s-pro/
- Author: Olivier Eeckhoutte
- Published: 2021-01-02T21:51:00Z
- Updated: 2021-01-02T21:51:00Z
- Language: fr
- Tags: cr10s pro, 3D Printer
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


![image](/images/creality-cr-10s-pro.jpg#center)

<br/>

**Réglage de l'axe X**

Pour le réglage de l'axe X, il faut utiliser la cale de 10cm fournie, la caler bien droite sous la courroie, et régler l'axe en faisant tourner la vis sans fin à l'arrière. (Tenez l'autre vis sans fin pour ne pas qu'elle tourne en même temps)

![image](/images/3d_print_x1.png)

<br/>

**Réglage de l'axe Z**

Visser toutes les vis du plateau à fond sans forcer et desserrer de 1 tour.

![image](/images/3d_print_z1.png)

<br/>

Allumer l'imprimante et chauffer le plateau à 60° et la buse à 200°  `(MENU: Temp > Manual > Nozzle 200° et Hot-Bed 60°)`

![image](/images/3d_print_z2.png)

<br/>

Une fois les températures atteintes, cliquer sur `MENU: Settings > Level mode`. La buse va se placer sur la position du milieu et avec les touches `Z+` et `Z-` ajuster la hauteur avec une feuille de papier A4. Il faut que la buse frotte le papier sans l’accrocher.

![image](/images/3d_print_z3.png)

<br/>

On va régler le détecteur de leveling. Pour ce faire, dévisser la vis du dessus jusqu'à ce que la led rouge soit éteinte, et revisser jusqu’à ce qu'elle se rallume.

![image](/images/3d_print_z4.png)

<br/>

Appuyer sur `Z Home`. La buse va se placer sur la position du milieu et ajuster de nouveau la buse avec une feuille de papier avec les touches `Z+` et `Z-` et cliquer à nouveau sur `Z Home`.

![image](/images/3d_print_z5.png)

<br/>

**Réglage de l'axe Y (réglage du plateau)**

2 méthodes existe, le faire manuellement sans les moteurs et sans le mode `AUX LEVELING`, ou en automatique avec le mode `AUX LEVELING`.

<br/>

**MANUEL**

Désactiver les moteurs en cliquant sur `MENU: Settings > Motor Off`

![image](/images/3d_print_y1.png)

<br/>

Déplacer manuellement la buse dans les 4 coins du plateau et régler la hauteur de plateau avec les vis en dessous. Avec une feuille de papier A4, il faut que la buse frotte le papier sans l’accrocher. Ne pas hésiter à faire le réglage une seconde fois. Régler le point du milieu en dernier.

![image](/images/3d_print_y2.png)

<br/>

**Automatique**

Cliquer dans `MENU: Settings > Level mode > AUX LEVELING`

![image](/images/3d_print_y3.png)

<br/>

Cliquer ensuite sur chaque coin, pour que la buse se déplace et ensuite régler la hauteur de plateau avec les vis en dessous. Avec une feuille de papier A4, il faut que la buse frotte le papier sans l’accrocher. Ne pas hésiter à faire le réglage une seconde fois. Régler le point du milieu en dernier.

Une fois que c'est fait, cliquer sur `Z Home`. Une fois que la buse s'est déplacé, cliquer sur `Check level`. La buse fera le check des 16 points.

![image](/images/3d_print_y4.png)

<br/>

**Tester l'impression**

Au début d'une impression, ajuster la hauteur de buse avec les boutons `Adjust > Z-` et `Z+`.

Valider votre configuration en imprimant [cette pièce](https://www.thingiverse.com/thing:3409848?fbclid=IwAR2Q3_BtI3UeNdZvZAobStS9_dGBbsSYJObGzkPBRsEdqdG9zqN2ktt7e3k).
[Direct Download](https://leandeep.com/Bed_calibration_for_CR-10S_PRO.zip)
