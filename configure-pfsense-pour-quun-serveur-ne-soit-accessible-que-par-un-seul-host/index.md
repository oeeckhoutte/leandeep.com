# Configure Pfsense pour qu'un serveur ne soit accessible que par un seul host

- Canonical URL: https://leandeep.com/configure-pfsense-pour-quun-serveur-ne-soit-accessible-que-par-un-seul-host/
- Author: Olivier Eeckhoutte
- Published: 2024-11-15T21:00:00+02:00
- Updated: 2024-11-15T21:00:00+02:00
- Language: fr
- Tags: Pfsense, Firewall
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Pour configurer pfSense de manière à ce qu'un serveur soit accessible uniquement par un seul autre ordinateur sur le même réseau, vous pouvez suivre les étapes suivantes en utilisant les règles de pare-feu.

<br/>

## Hypothèses

- Serveur à l'adresse IP: `192.168.1.10`
- Ordinateur autorisé à accéder à l'adresse IP: `192.168.1.20`
- Réseau local (LAN) est `192.168.1.0/24`
- Le serveur et l'ordinateur autorisé sont tous les deux sur l'interface LAN de pfSense.

<br/>

## Configuration

1. Accéder à l'interface de pfSense :

Connectez-vous à l'interface web de pfSense via https://<ip_de_pfSense>.

<br/>

2. Accéder à la configuration du pare-feu :

- Allez dans Firewall > Rules.
- Sélectionnez l'interface LAN (ou l'interface appropriée si vos appareils sont sur une autre interface).

<br/>

3. Créer une règle d'autorisation pour l'ordinateur autorisé :

- Cliquez sur Add pour ajouter une nouvelle règle.
- Configurez la règle comme suit:
  - Action: Pass
  - Interface: LAN
  - Address Family: IPv4
  - Protocol: Any (ou choisissez un protocole spécifique si nécessaire, comme TCP)
  - Source: Single host or alias, puis entrez 192.168.1.20 (IP de l'ordinateur autorisé)
  - Destination: Single host or alias, puis entrez 192.168.1.10 (IP du serveur)
  - Description: Entrez une description comme `Autoriser accès à 192.168.1.10 depuis 192.168.1.20`

- Cliquez sur Save pour enregistrer la règle.
- Cliquez sur Apply Changes pour appliquer la règle.

<br/>

4. Bloquer l'accès pour tous les autres appareils:

- Ajoutez une nouvelle règle sous celle que vous venez de créer.
- Configurez la règle comme suit:
  - Action: Block
  - Interface: LAN
  - Address Family: IPv4
  - Protocol: Any (ou choisissez un protocole spécifique)
  - Source: LAN net (ou choisissez Any si vous souhaitez bloquer tout le trafic)
  - Destination: Single host or alias, puis entrez 192.168.1.10 (IP du serveur)
  - Description: Entrez une description comme `Bloquer accès à 192.168.1.10 pour tous sauf 192.168.1.20`
- Cliquez sur Save pour enregistrer la règle.
- Cliquez sur Apply Changes pour appliquer la règle.

<br/>

## Important: Ordre des règles

Assurez-vous que la règle qui autorise l'accès depuis l'ordinateur autorisé (`Pass`) est placée avant la règle qui bloque tout le monde (`Block`). L'ordre des règles est crucial dans pfSense, car les règles sont évaluées de haut en bas.

<br/>

## Tester la configuration

Depuis l'ordinateur autorisé (192.168.1.20), essayez d'accéder au serveur (192.168.1.10). Vous devriez avoir accès.
Depuis un autre ordinateur sur le réseau (192.168.1.X), essayez d'accéder au serveur. L'accès devrait être refusé.

<br/>

## Autre
- Vous pouvez surveiller le trafic et voir les logs dans Status > System Logs > Firewall pour vérifier si les règles fonctionnent comme prévu.
- Pour des configurations plus avancées, envisagez d'utiliser des alias dans pfSense, ce qui permet de simplifier la gestion des règles.

<br/>

Cette configuration garantit que seul l'ordinateur spécifié peut accéder au serveur, tout en bloquant tous les autres appareils du réseau local.
