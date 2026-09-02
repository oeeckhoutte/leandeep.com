# Comment le RPA et Python me permettent de suivre les mouvements des fonds d'investissement

- Canonical URL: https://leandeep.com/comment-le-rpa-et-python-me-permettent-de-suivre-les-mouvements-des-fonds-dinvestissement/
- Author: Olivier Eeckhoutte
- Published: 2021-09-01T23:47:00+02:00
- Updated: 2021-09-01T23:47:00+02:00
- Language: fr
- Tags: RPA, Python, Finance, Automation
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

> Pour ceux qui ne connaissent pas est RPA, il s'agit du Robotic Process Automation. Voir [la définition dans Wikipédia](https://fr.wikipedia.org/wiki/Automatisation_robotis%C3%A9e_des_processus). Il existe pas mal de solutions élaborées comme UiPath, Automation Anywhere ou encore RPA-Python (anciennement TagUI).

Pour une fois, je ne vais pas rentrer dans trop de détails techniques et simplement vous parler de la manière dont j'ai automatisé une routine d'investissement sur des OPCVM.

Depuis quelque temps j'ai pris l'habitude de suivre la performance et l'évolution des portfolios de plusieurs fonds d'investissement sur Euronext, Nasdaq et S&P 500 et de quelques Gurus de la finance pour m'aider à faire les bons choix dans mes achats et reventes d'actions dans le but d'optimiser mes rendements sur le long terme. En plus de ce premier travail d'analyse, je mesure la santé des entreprises avec quelques indicateurs fondamentaux (par exemple Piotroski, Altman etc) pour essayer de comprendre leurs choix et pour les suivre ou non (à mon échelle bien évidemment).

Bien que ce soit passionnant, tout ceci est chronophage et par manque de temps, je suis passé à côté de belles opportunités. 
Je préfère gérer moi-même une partie de mon portfolio plutôt que de faire totalement confiance à des tiers. **Finalement qui mieux que soi-même peut prendre soin de ses finances ?**

Enfin bref, voici comment des outils comme RPA et un peu de code Python peuvent nous aider pour ce use case qui consiste à tracker les mouvements des portfolios de *funds*.

<br/>

## L'inaccessibilité des données 

Je ne vais pas lister ici les *funds* que je suis. Ce n'est pas l'objet de cet article et je ne suis pas CGP.

Sur tous les sites internet des assureurs ou fonds qui décrivent les produits financiers qui m'intéressent je n'ai jamais accès aux données qui m'intéressent de façon simple pour permettre de l'automatisation. Sauf très rare exception, il n'y a pas d'API ou encore de CSV. Il y a seulement des PDFs à télécharger. Ces PDFs décrivent les produits et contiennent des informations précieuses comme le nom des actions, leurs symboles, codes ISIN, le pourcentage de répartition dans le portfolio etc. Les liens pour télécharger ces PDFs sont toujours placés aux mêmes endroits sur les sites mais les URLs des liens changent à chaque mise à jour des PDFs. L'automatisation pur code est donc impossible. Il faut pouvoir naviguer sur le site internet pour récupérer les dernières versions des PDFs.

<br/>

## RPA et Python à la rescousse

Dans mon cas, je fais de la `Web Automation`. Pour cela, je recommande les packages Python suivants:

```
import rpa as r
import PyPDF2
```

> Bien sûr il y a pleins d'autres solutions pour la simple Web automation (cf. Google Puppeteer, Selenium) mais utiliser un outil de RPA permet de manipuler bien plus qu'un navigateur Web. Si on a besoin de faire de la `Visual Automation` sur Desktop ou encore de l'`OCR automation`... c'est possible mais surtout c'est possible simplement sans bricoler. 

Le premier package permet de faire du RPA et en l'occurrence d'ouvrir un fenêtre Chrome et d'exécuter une procédure automatisée. Dans mon cas, la procédure consiste à me rendre sur les sites de funds et télécharger les PDFs qui m'intéressent. 

> Example basique tiré de la doc de RPA-Python
> ```
> r.init()
> r.url('https://www.google.com')
> r.type('//*[@name="q"]', 'decentralization[enter]')
> print(r.read('result-stats'))
> r.snap('page', 'results.png')
> r.close()
> ```

Le second package permet d'extraire le contenu texte sélectionnable (et qui nous intéresse; notre data) dans les PDFS.

Exemple d'une fonction permettant d'extraire le contenu texte de la première page d'un PDF:

```
def extract_pdf_content(path: str) -> List[str]:
    with open(path, mode="rb") as f:
        reader = PyPDF2.PdfFileReader(f)
        page = reader.getPage(0)
        return page.extractText().splitlines()
```

<br/>

Aussi simple que cela. Avec quelques lignes de code supplémentaires, il est possible d'automatiser tout un suivi de portfolio et d'enrichir les données avec des indicateurs fondamentaux d'aide à la prise de décision et d'exporter le tout dans un dashboard ou un sheet... Au passage, cela peut permettre de limiter des frais de gestion demandés par certains organismes et d'avoir plusieurs stratégies d'investissement en parallèle sans que ce soit trop chronophage. Vous pouvez aussi piloter la partie achat et reventes des ordres chez votre broker avec validation utilisateur... &#128524;

<br/>

## La partie geek inutile

Je voulais que l'exécution du programme écrit en Python soit aussi simple que de double cliquer sur une icone et surtout que le programme soit standalone. Pas besoin de charger un virtualenv, ou de garder une version de Python particulière pour que cela fonctionne ou encore d'avoir toutes les libraires bien présentes... J'ai testé [pyinstaller](https://www.pyinstaller.org/) pour créer un bundle et cela fonctionne parfaitement &#129321;. 

<br/>

C'est une très bonne découverte. J'avais commencé à utiliser Rust pour pouvoir adresser cette problématique du binaire "self-contained" pour des utilitaires systèmes (ou pour des "side cars" très légers Python dans d'autres versions que le serveur); ce qui n'était pas possible simplement avec Python (contrairement à Go ou Rust) et finalement cela fonctionne très bien. Comme je code 10 000 fois plus vite en Python qu'en Rust, j'essayerais de créer mes prochains utilitaires systèmes personnels avec `pyinstaller`. J'en parlerais dans de prochains articles. 
