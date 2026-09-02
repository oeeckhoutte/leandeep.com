# Être notifié lorsqu'un long traitement est terminé

- Canonical URL: https://leandeep.com/%C3%AAtre-notifi%C3%A9-lorsquun-long-traitement-est-termin%C3%A9/
- Author: Olivier Eeckhoutte
- Published: 2018-11-01T19:02:00Z
- Updated: 2018-11-01T19:02:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Personnellement je trouve cela inutile de rester derrière mon écran à ne rien faire en attendant qu'un traitement long (entrainement Machine Learning, installation d'un Cluster...) se termine. 
Du coup, je passe à autre chose en attendant. Pour éviter de devoir sans cesse basculer d'une fenêtre à une autre, j'utilise des notifications. Je suis notifié lorsque mes traitements sont terminés. 

Pour ce faire j'ai juste à executer la commande suivante derrière la commande qui exécutera un long process ` && warnov`. (Je n'ai pas cherché longtemps pour le nom de ma commande: warnov pour "**warn** when it is **over**".

C'est simple et cela fonctionne très bien sur OSX. 
J'utilise les notifications système via l'alias suivant dans mon `~/zshrc`.

```
# Notifications
function _sys_notify() {
    local notification_command="display notification \"$2\" with title \"$1\""
    osascript -e "$notification_command"
}
alias warnov="_sys_notify 'Done' 'The long running process is over'"
```

Après un `source ~/.zshrc` essayez un `echo 'toto' && warnov`.

