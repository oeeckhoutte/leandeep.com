# Lister les desktop environments installés sur Ubuntu

- Canonical URL: https://leandeep.com/lister-les-desktop-environments-install%C3%A9s-sur-ubuntu/
- Author: Olivier Eeckhoutte
- Published: 2022-05-26T21:35:00Z
- Updated: 2022-05-26T21:35:00Z
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Second tiny tip du jour. Voici comment lister tous les desktop environments installés sur Ubuntu.

```
ls -l /usr/share/xsessions/
```

Output:

```
-rw-r--r-- 1 root root  155 janv.  9  2021 cinnamon.desktop
-rw-r--r-- 1 root root  268 janv.  9  2021 cinnamon2d.desktop
-rw-r--r-- 1 root root 8192 mars  23  2020 mate.desktop
-rw-r--r-- 1 root root  303 mars  26  2020 ubuntu.desktop
```

