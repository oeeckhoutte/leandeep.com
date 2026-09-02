# Rendre du code plus propre avec des namedtuples

- Canonical URL: https://leandeep.com/rendre-du-code-plus-propre-avec-des-namedtuples/
- Author: Olivier Eeckhoutte
- Published: 2020-08-18T23:02:09-07:00
- Updated: 2020-08-18T23:02:09-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Imaginons que nous souhaitions afficher le contenu d'une table de base de données contenant des informations sur les salariés d'une entreprise.
On peut utiliser une liste de tuples pour stocker en mémoire les lignes de la table. Chaque index d'un tuple correspond alors à une colonne de la table. Si la table contient les colonnes suivantes: "name", "birthdate", "salary" et "employment_date", `l'index 2` correspond donc au salaire d'un employé. C'est plutôt simple à retenir avec seulement 4 indexes mais si la table possède 20 colonnes, ce sera plus difficile à retenir. Et même si la table ne possède que 4 colonnes, `row[2]` n'est pas très parlant pour le développeur qui relira le code.
En utilisant les collections namedtuple, on peut apporter plus de clarté au code.

<br/>

## Anti-pattern (Pas bien!)

```
def print_employee_info(db_cursor):
    results = db_cursor.execute('SELECT * from employees').fetchall()
    for row in results:
        print(f"{row[0]}, born on {row[1]} was hired on {row[3]}. His salary is {row[2]}")
```

<br/>

## Bonne pratique (Bien!)

```
from collections import namedtuple

EmployeeRow = namedtuple('EmployeeRow', [
    'name',
    'birthdate',
    'salary',
    'employment_date'
])

EMPLOYEE_INFO = f"{name}, born on {birthdate} was hired on {employment_date}. His salary is {salary}"

def print_employee_info(db_cursor):
    results = db_cursor.execute('SELECT * from employees').fetchall()
    for row in results:
        employee = EmployeeRow._make(row)

        print(EMPLOYEE_INFO.format(**employee._asdict()))
```
