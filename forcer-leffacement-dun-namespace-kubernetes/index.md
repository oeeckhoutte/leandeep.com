# Forcer l'effacement d'un namespace Kubernetes

- Canonical URL: https://leandeep.com/forcer-leffacement-dun-namespace-kubernetes/
- Author: Olivier Eeckhoutte
- Published: 2020-10-05T19:49:00+02:00
- Updated: 2020-10-05T19:49:00+02:00
- Language: fr
- Tags: Kubernetes
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Parfois lorsqu'on tente d'effacer un namespace, il ne s'efface pas vraiment et reste dans l'état **terminated**.<br/>
Si vous essayez d'exécuter la commande `kubectl delete ns mon_namespace` et que vous recevez un message comme ci-dessous, ce tutoriel est fait pour vous:<br/>
`Error from server (Conflict): Operation cannot be fulfilled on namespaces "mon_namespace": The system is ensuring all content is removed from this namespace.  Upon completion, this namespace will automatically be purged by the system.`

<br/>

## Steps 

**1. Exporter le contenu du namespace au format json**

```
kubectl get namespace mon_namespace -o json > mon_namespace.json
```

<br/>

**2. Ouvrir le fichier `mon_namespace.json` et retirer `kubernetes` des `finalizers`**

<br/>

**3. Appelez l'API de votre cluster et mettez à jour votre namespace**

* Option 1
  ```
  kubectl cluster-info
  ```
  Puis exécuter la commande.
  ```
  curl -k -H "Content-Type: application/json" -X PUT --data-binary @/tmp/mon_namespace.json http(s)://[IP]:[PORT]/api/v1/namespaces/[NAMESPACE]/finalize
  ```
  Si vous n'avez pas l'erreur suivante, votre namespace va s'effacer.
  ```
  namespaces "mon_namespace" is forbidden: User "system:anonymous" cannot update namespaces/finalize in the namespace "mon_namespace"
  ```
  Si vous recevez le message précédent, suivez les instructions de l'option 2.

<br/>

* Option 2
  ```
  kubectl proxy  
  ```
  Puis exécuter la commande:
  ```
  curl -k -H "Content-Type: application/json" -X PUT --data-binary @/tmp/mon_namespace.json http://127.0.0.1:8001/api/v1/namespaces/[NAMESPACE]/finalize
  ```

<br/>

**4. Final check**
```
kubectl get namespaces
````

<br/>

Et voilà.

> [Lien vers article "commandes utiles Kubernetes"](https://leandeep.com/commandes-utiles-kubernetes/)
