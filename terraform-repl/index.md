# Terraform REPL

- Canonical URL: https://leandeep.com/terraform-repl/
- Author: Olivier Eeckhoutte
- Published: 2023-01-09T07:00:00+02:00
- Updated: 2023-01-09T07:00:00+02:00
- Language: fr
- Tags: tips, terraform
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Dans cet article, nous allons voir comment tester son code Terraform façon REPL. 
L'idée c'est de pouvoir rapidement dégainer un REPL pour pouvoir tester la bonne syntaxe de son code lorsqu'on veut le faire évoluer.

J'ai vu qu'il y avait des projets non officiel open source sur Github [comme celui-ci](https://github.com/paololazzari/terraform-repl) avec apparemment un vrai REPL mais je n'ai pas eu le temps de l'analyser et de vérifier qu'il n'y avait pas de bug et surtout de faille de sécurité. 

Pour mon besoin simple (test de syntaxe), on peut se contenter de `terraform console`, car c'est largement suffisant.

<br/>

Ouvrir un terminal et entrer les commandes suivantes: 
```
cd /tmp

cat <<EOF >test.tf
locals {
  ip_addresses = ["127.0.0.1", "0.0.0.1"]
}

terraform console <<EOF
concat("192.168.0.1", local.ip_addresses)
EOF
```

**Error en output car commande invalide:**

```
╷
│ Error: Invalid function argument
│
│   on <console-input> line 1:
│   (source code not available)
│
│ Invalid value for "seqs" parameter: all arguments must be lists or tuples; got string.
╵
```

<br/>

Même test mais avec une commande valide:

```
terraform console <<EOF
concat(["192.168.0.1"], local.ip_addresses)
EOF
```

**Output ok:**

```
[
  "192.168.0.1",
  "0.0.0.1",
  "127.0.0.1",
]
```

<br/>

Une fois terminé, `rm /tmp/test.tf`
