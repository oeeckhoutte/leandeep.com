# Commandes utiles Puppeteer 

- Canonical URL: https://leandeep.com/commandes-utiles-puppeteer/
- Author: Lean Deep
- Published: 2019-02-09T21:32:00Z
- Updated: 2019-02-09T21:32:00Z
- Language: fr
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction 

**"Puppeteer ou le remplaçant de Selenium."**
Dans cet article plutôt rapide, on retrouve les commandes de base pour créer un premier petit script qui va piloter un Chrome Headless.


<br/>

## Initialiser un browser non headless

```
try {
    (async () => {
		const browser = await puppeteer.launch({headless: false})
        
        [...]
       
	})()

} catch (err) {
    console.error(err)
}
```

<br/>

## Naviguer vers une page

```
const page = await browser.newPage()
await page.goto("https://url_du_site")
```

<br/>

## Ajouter du contenu dans un input type text

```
await page.type('#input_search', 'text_a_ajouter')
```

<br/>

## Cliquer sur un bouton

```
await page.click('#buttsearch')
```

<br/>

## Chercher dans tout le corps d'une page si un pattern existe

```
const found = (await page.content()).match(/Chiffre d\'affaires/) 
if (found) {
	
    [...]

}
```

<br/>

## Sélectionner un élément par href

```
const elementHandle = await page.$('a[href="#chiffrecle"]');
```

<br/>

## Obtenir le contenu texte d'un élément

```
const text = await (await elementHandle.getProperty('textContent')).jsonValue();
```

