# NodeJS OSX Catalina fix No receipt for com.apple.pkg.xxx

- Canonical URL: https://leandeep.com/nodejs-osx-catalina-fix-no-receipt-for-com.apple.pkg.xxx/
- Author: Olivier Eeckhoutte
- Published: 2019-12-30T14:02:00Z
- Updated: 2019-12-30T14:02:00Z
- Language: fr
- Tags: NodeJS
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Lors de l'installation de paquets NPM nécessitant de compiler du code vous pouvez rencontrer l'erreur suivante après avoir installé OSX Catalina. 

```
> node-gyp rebuild

No receipt for 'com.apple.pkg.CLTools_Executables' found at '/'.

No receipt for 'com.apple.pkg.DeveloperToolsCLILeo' found at '/'.

No receipt for 'com.apple.pkg.DeveloperToolsCLI' found at '/'.

gyp: No Xcode or CLT version detected!
gyp ERR! configure error

```
<br/>

Pour solutionner le problème exécutez la commande suivante:
```
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

