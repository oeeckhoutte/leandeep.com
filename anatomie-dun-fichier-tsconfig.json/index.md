# Anatomie d'un fichier tsconfig.json

- Canonical URL: https://leandeep.com/anatomie-dun-fichier-tsconfig.json/
- Author: Olivier Eeckhoutte
- Published: 2021-04-10T14:49:00+02:00
- Updated: 2021-04-10T14:49:00+02:00
- Language: fr
- Tags: Typescript
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article nous allons voir comment configurer correctement le compilateur Typescript.
<br/>
Voici un grand nombre d'options possibles pour configurer convenablement votre projet Typescript. J'ai essayé de décrire chacune d'entre elle. 
Bien configuré, vous pouvez avoir un *set* d'outils et un projet vous permettant d'être performant et qualitatif. Combiné avec du TDD avec un framework comme Jasmine, Chai ou core Jest et un coverage à 100% (oui oui j'ai bien dit 100%), je ne vous raconte pas la satisfaction du travail bien fait et la sérénité que vous aurez lors de vos mises en production...

<br/>

**tsconfig.json**

```
{
  "extends: "./tsconfig.base", // Il est possible de faire de l'héritage de fichier tsconfig.js
  "compilerOptions": { // contient toutes les rêgles permettant de configurer la compilation de notre projet Typescript
    "allowJs": false,
    "allowSyntheticDefaultImports": false,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "outDir": "./dist", // Dossier dans lequel sera contenu l'output de la compilation
    "noEmitOnError": true, // Recommandé. Ne crée pas de fichier d'output s'il y a une erreur Typescript
    "declaration": true, // permet de générer le fichier de déclaration (*.d.ts) pour créer des libs/packages importable dans d'autres projets par exemple
    "declarationDir": "./typings", // Spécifie le dossier dans lequel seront générés les fichiers *.d.ts
    "stripInternal": true, // Si l'annotation /** @internal */ est présente au-dessus d'une fonction, le fichier de *.d.ts généré ne contiendra pas de déclaration pour cette fonction
    "sourceMap": true, // Permet de générer les fichier *.map
    "inlineSources": true, // Permet d'inclure le code source Typescript dans les sourcemap
    "mapRoot": "./source-maps", // Spécifie le dossier dans lequel seront générés les fichiers sourceMaps
    "inlineSourcesMap": true, // Génére le contenu du sourceMap au format base64 inclus dans le fichier transpilé *.js
    "noImplicitAny": true, // Indispensable, sans quoi il suffit de faire du JS. Indique à Typescript que l'on ne veut pas type any implicite automatiquement ajouté
    "strictNullChecks": true, // Indispensable, sans quoi il suffit de faire du JS. undefined et null sont historiquement des sous-types de tous les types. Il faut donc faire en sorte qu'ils soient considérés comme des types à part entière. 
    "suppressImplicitAnyIndexError": false, // Recommandé à false. Si à true, on n'aurait pas d'erreur de compilation lorsqu'on voudrait ajouter un attribut à un objet dont le type n'a pas été définit dès le départ
    "suppressExcessPropertyErrors": false, // Recommandé à false. Si à true, on pourrait avoir des attributs facultatifs non déclarés dans les interface et ne pas avoir d'erreur de compilation
    "allowUnreachableCode": false, // Recommandé à false. Protège des code morts par exemple un return; puis du code
    "allowUnusedLabels": false, // Recommandé à false. Si un label n'est pas utilisée on aura une erreur de compilation 
    "noUnusedLocals": true, // Recommandé à true. Idem. Si une variable déclarée n'est pas utilisée on aura une erreur lors de la compilation
    "noUnusedParameters": true, // Recommandé à true. Idem. Si un paramètre d'une fonction n'est pas utilisé on aura une erreur lors de la compilation
    "noFallthroughCasesInSwitch" : true, // Personnellement j'ai bien. Ce paramètre force à utiliser un break; après être passé dans un case d'un switch.
    "noImplicitReturns": true, // Assez clair. Il faut absolument spécifier les return dans les fonctions; même les undefined. En effet "return undefined" doit être spécifié même dans les fonctions qui ne retournent rien
    "module": "es2015", // Définit la manière dont sont chargé les modules. Les instructions import et export sont préservées dans le JS généré avec es2015. 
    "target": "es2015", // Définit la version de JS dans lequel sera transpilé le code Typescript (en dehors de la gestion des modules)
    "moduleResolution": "node", // On gère les imports comme en NodeJS
    "traceResolution": true, // Ajoute des informations de debugging sur l'import des modules lors de la compilation Typescript
    "diagnostics": false, // Affiche des informations de debugging permettant d'optimiser éventuellement la performance de la compilation
    "listFiles": false, // Affiche les fichiers Typescript transpilés
    "listEmittedFiles": false, // Affiche les fichiers JS générés lors de la compilation
    "noImplicitUseStrict": false,
    "alwaysStrict": true, // Tous les fichiers modules ou globaux (sans import ou export) seront considérés comme des fichiers en strict mode
    "skipLibCheck": true // pour les libs comme Angular
    "removeComments": true, // Retire les commentaires
    "experimentalDecorators": true // Permet de créer ses propres décorateurs
  },
  "exclude": [], // Permet d'exclure des paths de la compilation (cf. node_modules, tmp_file, "src/**/*.tmp")
  "include": [], // idem que exclude mais l'inverse. Permet d'inclure des paths dans la compilation. 
  "files": [], // Permet de dire au compilateur quels paths charger. Cette config est prioritaire sur include et exclude
  "typeAcquisition": { // permet de configurer l'auto-complete et le type-checking des modules externes
    "enable": false
  },
  "compileOnSave": false,
  "atom": { // Atom ajoute ses propres propriétés. On peut les modifier

  },
  "angularCompilerOptions": { // Pour configurer les applications Angular

  }
}
```

> Installation de typescript: `npm install typescript --save-dev` ou `yarn add -D typescript`.

<br/>

Ce fichier `tsconfig.json` est pris en compte lorsque la commande `npx tsc [-w]` est exécutée.


> Ajouter l'annotation suivante au-dessus d'une fonction `/** @internal */` permet de ne pas générer sa déclaration dans le fichier `*.d.ts`.

