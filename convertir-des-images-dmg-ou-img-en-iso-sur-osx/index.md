# Convertir des images dmg ou img en iso sur OSX

- Canonical URL: https://leandeep.com/convertir-des-images-dmg-ou-img-en-iso-sur-osx/
- Author: Olivier Eeckhoutte
- Published: 2020-01-23T20:49:00+02:00
- Updated: 2020-01-23T20:49:00+02:00
- Language: fr
- Tags: Tip, OSX, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


**Convertir une image img en iso**

```
hdiutil convert input.img -format UDTO -o output.iso
```

<br/>

**Convertir une image dmg en iso**
```
hdiutil convert input.dmg -format UDTO -o output.iso
```
