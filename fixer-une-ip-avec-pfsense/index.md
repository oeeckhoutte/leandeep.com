# Fixer une IP avec Pfsense

- Canonical URL: https://leandeep.com/fixer-une-ip-avec-pfsense/
- Author: Olivier Eeckhoutte
- Published: 2025-01-11T23:32:00+02:00
- Updated: 2025-01-11T23:32:00+02:00
- Language: fr
- Tags: tips, firewall, pfsense
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



**Configurer une IP fixe dans pfSense**

- Allez dans `Services > DHCP Server`.
- Sélectionnez l'interface correspondante (par exemple, LAN).
- Ajouter une réservation DHCP :
  - Descendez jusqu'à la section `DHCP Static Mappings for this Interface`.
  - Cliquez sur Add (+).
  - Configurer les détails de la réservation :
    - MAC Address : Entrez l'adresse MAC de l'appareil.
    - IP Address : Choisissez une adresse IP fixe dans la plage autorisée mais en dehors de la plage dynamique du DHCP.
- Save
- Appliquer

