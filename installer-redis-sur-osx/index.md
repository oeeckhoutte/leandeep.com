# Installer Redis sur OSX

- Canonical URL: https://leandeep.com/installer-redis-sur-osx/
- Author: Olivier Eeckhoutte
- Published: 2015-11-22T21:35:00Z
- Updated: 2015-11-22T21:35:00Z
- Language: fr
- Tags: Redis, OSX, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici un petit article rapide pour installer et utiliser Redis en local sur son Mac.

**Installer Redis via HomeBrew**
```
brew install redis
```

<br/>

**Démarrage de Redis au boot d'OSX**
```
ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents
```

<br/>

**Démarrer Redis via launchctl**
```
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

<br/>

**Retirer le démarrage automatique de Redis au boot d'OSX**
```
launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

<br/>

**Désinstaller Redis**
```
brew uninstall redis
rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

<br/>

**Vérifier que Redis est bien démarré:**
```
redis-cli ping

# PONG
```

<br/>

**Administration GUI**

[https://github.com/humante/redis-browser](https://github.com/humante/redis-browser)

Web based GUI on [http://localhost:4567](http://localhost:4567)
```
# Install it with $ gem install redis-browser
# gem install redis-browser

# Run it with $ redis-browser
== Sinatra (v2.0.5) has taken the stage on 4567 for development with backup from WEBrick
INFO  WEBrick::HTTPServer#start: pid=10586 port=4567

```

