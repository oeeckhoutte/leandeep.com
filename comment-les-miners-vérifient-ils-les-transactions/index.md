# Comment les miners vérifient-ils les transactions ?

- Canonical URL: https://leandeep.com/comment-les-miners-v%C3%A9rifient-ils-les-transactions/
- Author: Olivier Eeckhoutte
- Published: 2020-12-19T19:19:00Z
- Updated: 2020-12-19T19:19:00Z
- Language: fr
- Tags: Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


> Un schéma (surtout quand il est magnifique :D) vaut mieux qu'un long discours...

![image](/images/verification-transactions.png)

<br/>
Lorsque je veux envoyer un message dans la blockchain, une signature en plus du message est créée à partir de ma clé privée.
<br/>
<br/>
L'ensemble {message + signature + clé publique} est envoyé dans une transaction. 
<br/>
<br/>
Ces 3 informations permenttent aux miners de valider la légitimité de la transaction grâce à une fonction de validation. 
