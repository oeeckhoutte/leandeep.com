# The cutest dog of the InterPlanetary File System

- Canonical URL: https://leandeep.com/the-cutest-dog-of-the-interplanetary-file-system/
- Author: Olivier Eeckhoutte
- Published: 2021-04-10T20:49:00+02:00
- Updated: 2021-04-10T20:49:00+02:00
- Language: fr
- Tags: IPFS, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Tout est dans le titre. Si vous ne connaissez pas IFPS https://ipfs.io/, je vous recommande d'aller jeter un oeil !


<div style="word-wrap: break-word;"><b>Image URL -> </b><a target="_blank" href="https://ipfs.io/ipfs/QmRHUJ4fMMvj5A5NXeXHfRuVCX5uCzWqzSvd3JpctzhsvZ?filename=fauve.png">https://ipfs.io/ipfs/QmRHUJ4fMMvj5A5NXeXHfRuVCX5uCzWqzSvd3JpctzhsvZ?filename=fauve.png</a><br/><center><img src="https://ipfs.io/ipfs/QmRHUJ4fMMvj5A5NXeXHfRuVCX5uCzWqzSvd3JpctzhsvZ?filename=fauve.png" width="50%" height="100%"></center></div>


<br/>
**Extrait Wikipédia**

![image](/images/ipfs.png)

<br/>

Le navigateur Brave a ajouté le support à ce protocole: https://brave.com/ipfs-support/

<br/>

**Extinction du daemon (photo toujours accessible) et optimisation**

J'ai éteint le daemon IPFS qui tourait sur mon Mac, vidé mon cache et rechargé cette page et la photo de mon chien est toujours accessible. La photo a donc été répliquée chez d'autres peers. Il faut encore que je creuse pour savoir combien de peers possèdent cette photo (ou chunks de photo). Est-elle réllement ad vitam æternam stockée sur IPFS ?

![image](/images/ipfs-daemon-stopped.png)

![image](/images/no-cache.png)

La réponse est non, j'ai fait le test. Même si la photo était peut être présente chez d'autres peers et sur la gateway ipfs.io, il suffit le peer s'arrête ou efface le contenu de son disque dur et la photo n'est plus accessible. Filecoin https://filecoin.io/ prend donc tout son sens pour incentiver les gens à garder le contenu des autres personnes en échange d'une petite rémunération.

Autre possibilité, si je *pin* le fichier sur mon instance d'IPFS, laisse tourner le daemon sur un serveur derrière une box (ou 2) ayant la fibre, le fichier devrait toujours rester accessible. Il sera mis en cache par la gateway IPFS ipfs.io quand quelqu'un accédera au lien de partage.

Maintenant reste à savoir comment protéger sa bande passante locale si on laisse tourner ce noeud (A moins que vous ayez un serveur qui traine quelque part et qui ne sert à rien bien sûr). Sujet largement débattu ici: https://github.com/ipfs/go-ipfs/issues/3065

J'ai repéré ceci: https://github.com/mariusae/trickle
`trickle -s -u 50 -d 50 ipfs daemon --routing=dhtclient`

Et aussi:
`ipfs config profile apply lowpower`

Cette dernière méthode semble améliorer les choses mais il y a encore quelques pics. 

![image](/images/ipfs-pics.png)


Alternatives:
* https://filecoin.io/
* https://storj.io/
* https://maidsafe.net/
* https://www.ethereum.org/ (related storage layer)
* https://ethersphere.github.io/swarm-home/
* Chia (Je l'ai miné quelque temps)

<br/>

**Conclusion**
<br/>
Encore une fois, de nouvelles perspectives s'offrent à nous. J'adore mon métier car il y a sans cesse des nouveautés, nouveaux concepts. En plus, d'avoir enregistré à jamais cette magnifique photo dans l'IPFS, je vais pouvoir me passer d'Algolia pour le moteur de recherche de ce site headless. Je vais pouvoir aller un cran plus loin dans le décentralisé, serverless, headless. Et tout ceci est gratuit...
