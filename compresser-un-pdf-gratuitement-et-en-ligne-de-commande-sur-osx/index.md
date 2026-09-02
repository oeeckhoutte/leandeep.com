# Compresser un PDF gratuitement et en ligne de commande sur OSX

- Canonical URL: https://leandeep.com/compresser-un-pdf-gratuitement-et-en-ligne-de-commande-sur-osx/
- Author: Olivier Eeckhoutte
- Published: 2021-12-29T19:43:00Z
- Updated: 2021-12-29T19:43:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


J'avais impérativement besoin de compresser un PDF et le faire passer 33Mo à 5 ou 6Mo max en gardant une qualité correcte. 

Il y a pleins d'outils et d'articles sur internet expliquant comment faire cela et franchement c'est une perte de temps. 

> Le compression intégrée directement dans `Preview` ne me donnait pas satisfaction car le rendu était flou.

<br/>

### Ghostscript

```
brew install ghostscript
gs -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH -dPDFSETTINGS=/screen -dCompatibilityLevel=1.4 -sOutputFile=output.pdf sign.pdf
gs -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH -dPDFSETTINGS=/ebook -sOutputFile=output2.pdf sign.pdf
```

> -dQUIET: Retire les logs sur stdout<br/>
> -dNOPAUSE: Pas de pause entre chaque page<br/>
> -dBATCH: Permet de stopper le process quand toutes les pages ont été traitées

> -dPDFSETTINGS=<br/>
> - /screen (72 dpi) low resolution<br/>
> - /ebook (150 dpi) medium resolution<br/>
> - /printer (300 dpi)<br/>
> - /prepress (300 dpi)<br/>
> - /default (72 dpi)<br/>
