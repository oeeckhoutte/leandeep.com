# Commandes custom utiles Openshift

- Canonical URL: https://leandeep.com/commandes-custom-utiles-openshift/
- Author: Olivier Eeckhoutte
- Published: 2019-06-25T09:43:00Z
- Updated: 2019-06-25T09:43:00Z
- Language: fr
- Tags: Openshift
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Lister les utilisateurs ayant le rôle cluster-admin

*A partir de 3.9*:
```
oc get clusterrolebinding -o json | jq '.items[] | select(.metadata.name |  startswith("cluster-admin")) | .userNames'
```

<br/>

## Ajouter un rôle cluster à un utilisateur
```
oc adm policy add-cluster-role-to-user <cluster-role> <user>
```

<br/>

## Retirer un rôle cluster à un utilisateur
```
oc adm policy remove-cluster-role-from-user <cluster-role> <user>
```

<br/>

## Lister les pods en erreur (ou n'ayant pas le status Running)
```
oc get pods --all-namespaces | awk '!/Running/ {print}'
```

<br/>

## Lister les pods en erreur par namespace
```
oc get pods --all-namespaces | awk '!/Running/ {print}' | awk 'NR>1{arr[$1]++}END{for (a in arr) print a, arr[a]}' | sort -nrk2
```

<br/>

## Ne garder que 2 déploiements
```
oc adm prune deployments --orphans --keep-failed=2 --keep-complete=2  --confirm
```

<br/>

## Ne garder que 2 builds
```
oc adm prune builds --orphans --keep-failed=2 --keep-complete=2  --confirm
```

