# Gérer proprement ses variables d'environnement de type boolean sur Ansible

- Canonical URL: https://leandeep.com/g%C3%A9rer-proprement-ses-variables-denvironnement-de-type-boolean-sur-ansible/
- Author: Olivier Eeckhoutte
- Published: 2017-09-17T18:20:00Z
- Updated: 2017-09-17T18:20:00Z
- Language: fr
- Tags: Ansible
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Cet article très rapide explique comment *caster* proprement des variables d'environnement de type bool passées à un Playbook.

Si l'utilisateur entre `yes`, `1`, `True` cela sera considéré de la même manière si vous utilisez cette commande:

```
{{ votre_var | d() | bool }}
```

Le d() (pour default) est utile pour ne pas avoir une erreur disant que `votre_var` n'est pas définie.

```
from jinja2 import Template
from ansible.runner.filter_plugins.core import bool
Template('').environment.filters['bool'] = bool
tmpl = Template('{{ var | d() | bool }}')
>>> print tmpl.render()
False
>>> print tmpl.render(var=None)
None
>>> print tmpl.render(var='')
False
>>> print tmpl.render(var='toto')
False
>>> print tmpl.render(var=' ')
False
>>> print tmpl.render(var='True')
True
>>> print tmpl.render(var=[])
False
>>> print tmpl.render(var=['list'])
False
>>> print tmpl.render(var={})
False
>>> print tmpl.render(var={'key': 'value'})
False
```

