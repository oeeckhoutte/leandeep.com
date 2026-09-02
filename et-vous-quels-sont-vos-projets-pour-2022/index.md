# Et vous quels sont vos projets pour 2022 ?

- Canonical URL: https://leandeep.com/et-vous-quels-sont-vos-projets-pour-2022/
- Author: Olivier Eeckhoutte
- Published: 2022-01-04T07:00:00+02:00
- Updated: 2022-01-04T07:00:00+02:00
- Language: fr
- Tags: Projects
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Chaque année, j'aime me fixer des objectifs professionnels **en supplément de** mon activité principale. 

Voici donc mon programme pour l'année 2022 (beaucoup plus simple que l'annéee 2021). En gros cela se résume en 5 maîtres-mots: `Blockchain`, `Rust`, `Trading`, `Veille` & `Innovation`.

<br/>

**1. Utiliser Rust pour tous mes développements personnels** ("développements professionels à usage personnel" devrais-je plutôt écrire) #TopPrio1
 - Torrent client app (wrap C++ lib en Rust) expérimentation
 - Secu app (sur Mobile device)
 - Notification app (un socle très simple et utilisable via API call en local pour toutes mes automations) (gui natif OS X)
 - Cross-platform expérimentation lib/app (lib Rust partagée sur Android et iOS, et/ou Flutter et/ou Webassembly)
 - 2 Apps: voir les points `2.2` et `2.3` ci-dessous
 - (Utiliser Actix et GraphQL dans une de ces apps)
 - Algolia clone (search engine simple) en Rust / Webassembly / Service Worker
 - Rust on embedded device (example Arduino)

**2. Blockchain Développement (Smart contracts dev/ Web3)** #TopPrio2
 - 2.1. Arbitrage app (en Python. Comme le développement de ce projet est beaucoup trop avancé pour tout recommencer en Rust et que c'est un sujet data (par rapport à ma stratégie de trading) le langage Python est très bien adapté à ce sujet). J'aimerais ré-écrire les smart contracts en Rust (ou Yul à voir l'intérêt) plutôt que Solidity car philosophiquement j'ai dû mal avec le language Solidity qui n'a pour seul intérêt que le développement EVM (certes énorme...). Si Solidity ne peut pas être remplacé (tout dépendra d'ewasm je dirais), je garderai Solidity.
 - 2.2. Trades "irréalistes" bot en Rust (Smart contract en Rust) + CEX (et non DEX) scanning (par simplicité et car il y a déjà énormément d'opportunités) + Metamask. Donc détection des opportunités sur CEX et trades sur DEX pour pouvoir placer autant d'ordres limites que je veux sans bloquer du capital (au passage je vous ai donné une petite stratégie de trading simple et bien rentable; c'est cadeau &#128513;)
 - 2.3. Portfolio export to Google spreadsheet pour au moins 2 des CEX que j'utilise (en Rust même si en Python c'est simplicime à faire). L'objectif est d'être aussi fluide en Rust qu'en Python...


**3. Scalping** #Profit #TopPrio3
 - Pas d'automatisation. Approfondissement d'un autre métier et d'autres outils

**4. Analyse Fondamentale et investissements** #Profit #TopPrio4
 - Business Analysis
 - Price tracking/alerting app nécessaire (Rust) pour projets crypto à forts portentiels (revente auto de positions à différents échelons)
 - Euronext vision 360 tracker (une v2 en RPA)

**5. Ethical hacking** (par passion depuis toujours)

**6. Lire un livre de développement personnel**

**7. Creuser React 360 si le temps le permet** et builder une petite interface compatible Oculus/Meta Quest 2 + étudier comment se construisent les environnements de jeux vidéo/ simulation avec des personnages animés en VR (peut être bcp plus évolués que React 360) #Veille

**8. Monter un node Chainlink** si ROI et bande passante #Profit

**9. Monter un node theGraph** si ROI, bande passante et si un node Archive Ethereum n'est plus nécessaire #Profit

**10. Expérimenter Reality Capture API** (si j'ai pu m'offrir un nouveau Macbook pro &#128517;) et comparer le résultat du 3D scanning avec le Lidar de l'iPhone. #Veille

**11. Asservir un robot avec ROS (Robot Operating System)** (Simulation puis déploiement sur vrai simple robot DIY) #Veille

**12. Construire un LED matrix Wifi** pour afficher le cours du BTC ou "en réunion" ou valeur de mon portfolio ou opportunité de trade... #Profit

**13. Piloter un LED matrix avec Streamdeck + Test trading avec Streamdeck** #Fun #Profit

**14. Tester une découpeuse Laser ou CNC** (pour création PCB ou autre) #Veille #IoT #Fun

**15. Tester une imprimante 3D résine** #Veille

**16. ROS avec un 6Dof Robot arm** (si le budget le permet bien évidemment. Il doit être équipé d'un petit laser cut de 2.5W) #Veille
