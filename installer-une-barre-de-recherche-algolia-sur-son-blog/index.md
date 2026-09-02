# Installer une barre de recherche Algolia sur son blog

- Canonical URL: https://leandeep.com/installer-une-barre-de-recherche-algolia-sur-son-blog/
- Author: Olivier Eeckhoutte
- Published: 2020-03-01T19:49:00+02:00
- Updated: 2020-03-01T19:49:00+02:00
- Language: fr
- Tags: Algolia
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

L'objectif de cet article est de voir comment installer un moteur de recherche [Algolia](https://www.algolia.com/) sur son blog Hugo pour pouvoir rechercher n'importe quel contenu.

Le résultat final sur mon blog:

![image](/images/algolia1.png)

![image](/images/algolia2.png)


<br/>

## Création de compte Algolia


La première chose à faire est de créer un compte Algolia.

Vous pouvez souscrire à un plan community. Cela vous permettra de créer une barre de recherche gratuitement.

Créer une application.

Créer ensuite un indice. Un indice peut contenir un ou plusieurs indexes.

Enfin créer un index.

Dans l'onglet API Keys, récupérez l'`Application ID` et l'`Admin API Key`. 

<br/>

## Indexation du contenu du blog

Nous allons utiliser une librairie NodeJS appelée `atomic-algolia` permettant de générer et d'envoyer des indices Hugo sur Algolia.


Voici donc les commandes à exécuter dans le dossier racine de votre blog Hugo:

```
npm install atomic-algolia --save
npm init
```

Ajouter la ligne suivante dans la section `scripts` du fichier `package.json`:

```
"algolia": "atomic-algolia"
```

Créer un fichier `.env` et renseigner les variables d'environnement suivantes:

```
ALGOLIA_APP_ID=YOUR_APPLICATION_ID
ALGOLIA_ADMIN_KEY=YOUR_ADMIN_API_KEY
ALGOLIA_INDEX_NAME=YOUR_INDEX_NAME
ALGOLIA_INDEX_FILE=public/algolia.json
```

Générer le fichier json d'indexation de contenu de votre blog et envoyer le sur Algolia:

```
npm run algolia
```

<br/>

## Création de la barre de recherche

Nous allons maintenant voir comment ajouter une barre de recherche sur son site.

Voici le code source de la barre de recherche sur mon site:

```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/instantsearch.js/1/instantsearch.min.js"></script>

<style>

.nav-search {
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  position: relative;
  width: 90%;
  height: 47px;
  margin-top: 20px; 
  background-color: white;
  z-index: 1000;
}

.nav-search.active {
  box-shadow: 0 4px 4px rgba(79, 79, 79, 0.21);
}
.nav-search.active .search-dropdown {
  display: block;
}

.nav-search.active .search-input {
  -webkit-animation: expand-search-box-animation 0.5s forwards;
  animation: expand-search-box-animation 0.5s forwards;
}

.nav-search.active .search-input input {
  border-width: 2px;
}

.nav-search.active .search-input .close-search {
  display: inline-block;
}

.nav-search.active .search-input .search-dropdown {
  display: block;
}

.nav-search .search-input {
  transition: left 0.2s ease-in-out;
  transition: width 0s ease-in-out;
}

.nav-search .search-input .search-icon {
  position: absolute;
  left: 15px;
  top: 13px;
  z-index: 999;
  color: black;
}

.nav-search .search-input input {
  font: 16px/1.875 "Avenir Next W01", "Avenir Next", "Helvetica Neue", Helvetica, sans-serif;
  height: 50px;
  border: 1px solid #1b98f4;
  border-radius: 4px;
  min-width: 200px;
  width: 100%;
  padding-left: 50px;
  background-color: white;
}

.nav-search .search-input input:focus {
  outline: none;
}

.nav-search .search-input i.close-search {
  color: #1b98f4;
  display: none;
  position: absolute;
  right: 15px;
  top: 13px;
  cursor: pointer;
}

.search-dropdown {
  box-sizing: border-box;
  color: #B3B3B3;
  font: 14px/1.875 "Avenir Next W01", "Avenir Next", "Helvetica Neue", Helvetica, sans-serif;
  opacity: 1.00;
  padding: 20px;
  width: 100%;
  -webkit-animation: expand-search-dropdown-animation 0.5s forwards;
  animation: expand-search-dropdown-animation 0.5s forwards;
  overflow-y: scroll;
  max-height: 400px;
  border-radius: 0 0 4px 4px;
  background-color: #FCFCFC;
  border: 1px solid #E0E0E0;
  box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.09);
  display: none;
  background-color: white;
}

.search-dropdown .small {
  -webkit-flex-basis: 35%;
  -ms-flex-preferred-size: 35%;
  flex-basis: 35%;
}

.search-dropdown .search-section .hits-blank {
  color: #666;
  text-align: center;
  padding-top: 20px;
}

.search-dropdown a {
  text-decoration: none;
  color: inherit;
  z-index: 2000;
}

.hit {
  border-bottom: 1px solid #E6E6E6;
  margin-bottom: 20px;
}

.hit .hit-title {
  color: #1b98f4;
  font-family: 'bt_mono', monospace;
  font-weight: 500;
  margin-bottom: 0;
  margin-top: 0;
  display: inline-block;
  font-size: 14px;
}
.hit .hit-description {
  text-decoration: none;
  color: black;
  font-size: 14px;
  display: block;
  margin-top: 3px;
}
.hit .hit-anchor {
  font-size: 13px;
  color: #666;
}
.hit .algolia-docsearch-suggestion--highlight {
  background-color: #FFE9A4;
}

.ais-hits--item:last-child .hit {
  border: 0;
}

</style>

<script>

    $(function() {

        $('#search-input').on('keyup', function() {
            $('.nav-search').addClass('active');
            $('#hits-container').scrollTop(0);
        })

        $('.close-search').on('click', function(evt) {
            evt.preventDefault();
            $('#search-input').val('');
            $('.nav-search').removeClass('active');
        })

        $('#search-input').on('blur', function(evt) {
            if(!evt.isDefaultPrevented) {
                $('.nav-search').removeClass('active');
            }
        })

        
        let search = instantsearch({
            appId: 'YOUR_APPLICATION_ID',
            apiKey: 'YOUR_READONLY_API_KEY',
            indexName: 'YOUR_SEARCH_INDEX',
            searchParameters: {replaceSynonymsInHighlight: false},
            searchFunction: function(helper) {
                var searchResults = $('.search-results');
                if (helper.state.query === '') {
                    searchResults.hide();
                    return;
                }
                helper.search();
                searchResults.show();
            }
        });

        // add a searchBox widget
        search.addWidget(
            instantsearch.widgets.searchBox({
                container: '#search-input',
                placeholder: 'Search for libraries in France...'
            })
        );

        // add a hits widget
            search.addWidget(
                instantsearch.widgets.hits({
                    container: '#hits-container',
                    hitsPerPage: 10,
                    debug: true,
                    templates: {
                    item: '<a href="\{\{url\}\}" target="_blank"><div class="hit"><div class="hit-content"><h2 class="hit-title">\{\{\{_highlightResult.title.value\}\}\}</h2><br><small>\{\{lvl0\}\} \{\{#lvl1\}\}> \{\{\{_highlightResult.lvl1.value\}\}\} \{\{/lvl1\}\}\{\{#lvl2\}\}> \{\{\{_highlightResult.lvl1.value\}\}\} \{\{/lvl2\}\}\{\{#lvl3\}\}> \{\{\{_highlightResult.lvl3.value\}\}\} \{\{/lvl3\}\} \{\{#lvl4\}\}> \{\{\{_highlightResult.lvl4.value\}\}\}\{\{/lvl4\}\}</small><p class="hit-description">\{\{\{_snippetResult.content.value\}\}\}</p></div></div></a>',
                    empty: '<div id="no-results-message"> <p>We didn`t find any results for the search <em>"\{\{query\}\}"</em>.</p></div>'
                    }
                })
            );

        // start
        search.start();
    
    });

</script>
```


Pour que votre index soit utilisé, il suffit de remplacer la valeur des variables `appId: 'YOUR_APPLICATION_ID'`, `apiKey: 'YOUR_READONLY_API_KEY'` et `indexName: 'YOUR_SEARCH_INDEX'` dans le code ci-dessous par les votres.

Algolia est un très bon service SAAS que je recommande. Il est excessivement intuitif et vraiment très performant.
