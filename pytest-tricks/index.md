# Pytest tricks

- Canonical URL: https://leandeep.com/pytest-tricks/
- Author: Olivier Eeckhoutte
- Published: 2018-04-04T21:53:00Z
- Updated: 2018-04-04T21:53:00Z
- Language: fr
- Tags: Python, Pytest
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Mocker l'ouverture d'un fichier et tester les exceptions

Pour la fonction suivante, il est possible d'exécuter différents tests.
Les 3 exemples de tests ci-dessous montrent:
- Comment vérifier qu'un appel de fonction raise une exception
- Comment vérifier qu'un fichier de config est valide
- Comment créer un fichier de config temporaire "bouchonné".


```
import os 
import json

class InvalidConfig(Exception):
    pass

def load_config(config_path):
  try:
      with open(config_path, 'r') as json_file:
          return json.load(json_file)
  except (OSError, IOError, json.JSONDecodeError) as exception:
      raise InvalidConfig(exception)

```

```
def test_missing_conf_file():
	with pytest.raises(InvalidConfig):
	    load_config('does-not-exist.json')

```

```
def test_invalid_conf_file(tmpdir):
	json_content = (
    	'%%%%%%%%%%\n'
	)
    tmp_config = tmpdir.join('temp-config_file.json')
    tmp_config.write_text(json_content, encoding='utf-8')
    with pytest.raises(InvalidConfig):
    	load_config(tmp_config.strpath)
```

```
def test_valid_conf_file(tmpdir):
	json_content = (
    	'{\n'
        '"hello": "olivier", \n'
        '"titi": "tata"\n'
        '}\n'
	)
    tmp_config = tmpdir.join('temp-config_file.json')
    tmp_config.write_text(json_content, encoding='utf-8')
    parsed_config = load_config(tmp_config.strpath)
    assert parsed_config['hello'] == 'olivier'
    assert parsed_config['titi'] == 'tata'

```

<br/>

## Parametrize tests with fixtures

**Option 1**

Exemple: 

```
import pytest

def integer_to_binary(input, zero_pad_length=0):
    """
    Converts an integer to a zero-padded binary string.
    """
    return "{{:0{}b}}".format(zero_pad_length).format(input)

@pytest.fixture(params=[{"input": 8, "expectedResult": "1000"}, {"input": 5, "expectedResult": "0"}, {"input": 1, "expectedResult": "1"}])
def testCase(request):
    return request.param

def test_my_converter(testCase):
    result = integer_to_binary(testCase["input"])
    assert result == testCase["expectedResult"]

```

Output:

```
====================================================================================================== test session starts ======================================================================================================
platform darwin -- Python 3.7.3, pytest-4.5.0, py-1.8.0, pluggy-0.11.0 -- /Users/olivier/Dev/.venv/bin/python3.7
cachedir: .pytest_cache
rootdir: /Users/olivier/Dev/
collected 3 items

test_tmp.py::test_my_converter[testCase0] PASSED                                                                                                                                                                          [ 33%]
test_tmp.py::test_my_converter[testCase1] FAILED                                                                                                                                                                          [ 66%]
test_tmp.py::test_my_converter[testCase2] PASSED                                                                                                                                                                          [100%]

=========================================================================================================== FAILURES ============================================================================================================
_________________________________________________________________________________________________ test_my_converter[testCase1] __________________________________________________________________________________________________

testCase = {'expectedResult': '0', 'input': 5}

    def test_my_converter(testCase):
        result = integer_to_binary(testCase["input"])
>       assert result == testCase["expectedResult"]
E       AssertionError: assert '101' == '0'
E         - 101
E         + 0

test_tmp.py:15: AssertionError
============================================================================================== 1 failed, 2 passed in 0.08 seconds ===============================================================================================
```

<br/>

**Option 2**

Example

```
import pytest

def integer_to_binary(input, zero_pad_length=0):
    """
    Converts an integer to a zero-padded binary string.
    """
    return "{{:0{}b}}".format(zero_pad_length).format(input)


@pytest.mark.parametrize('input, expectedResult', [(8, "1000"), (5, "0"), (1, "1")])
def test_integer_to_binary(input, expectedResult):
    assert expectedResult == integer_to_binary(input)
    
```

Same Output.

<br/>

## Scopes des fixtures

**Une fixture peut avoir plusieurs scopes: test, module ou session.**

Exemple de fixture au niveau des tests:

```
@pytest.fixture()
def user():
	print("Creating user")
    return User('Python', 'Awesome')

def test_is_prime(user):
	assert is_prime(user, 2) is True
	assert is_prime(user, 3) is True    
	assert is_prime(user, 4) is False

def test_prime_factors(user):
	assert prime_factors(user, 2) == [2]
	assert prime_factors(user, 12) == [2, 2, 3]

```

Exemple de fixture au niveau du module:

> Il suffit de changer le scope dans l'annotation `@pytest.fixture()`:

```
@pytest.fixture(scope='module')
def user():
	print("Creating user")
    return User('Python', 'Awesome')

...

```

<br/>

## Tagger ses tests avec des fixtures

Exemple:

```
import pytest
import math_func

@pytest.mark.strings
def test_add_strings():
	result = math_func.add('Hello', ' World')
    assert result == 'Hello World'
    assert type(result) is str

```

Appeler les tests ayant un tag particulier:

```
pytest -v -m strings
```

<br/>

## Skipper un test (grâce à un tag)

**Simple skip**

Exemple:

```
import pytest
import math_func

@pytest.mark.skip(reason='do not run this test for no reason')
def test_add_strings():
	result = math_func.add('Hello', ' World')
    assert result == 'Hello World'
    assert type(result) is str

```

Exécution: 

```
pytest -v
```

<br/>

**skipif**

Exemple:

```
import pytest
import math_func
import sys

@pytest.mark.skipif(sys.version_info < (3, 3), reason='')
def test_add_strings():
	result = math_func.add('Hello', ' World')
    assert result == 'Hello World'
    assert type(result) is str

```

Exécution: 

```
pytest -v
```

<br/>

## Code d'initialisation et de clôture des tests

**Option 1: Setup and Teardown**

Exemple de code de setup (Connection à une BDD par exemple):

Au lieu de:

```
import pytest

def test_olivier_data():
	db = StudentDB()
    db.connect('data.json')
    olivier_data = db.get_data('Olivier')
    assert olivier_data['id'] == 1
    assert olivier_data['name'] == 'Olivier'

```

On peut initialiser la fonction `setup_module` qui sera exécutée au démarrage des tests:

On écrit plutôt: 

```
import pytest

db = None
def setup_module(module):
	db = StudentDB()
    db.connect('data.json')

def test_olivier_data():
    olivier_data = db.get_data('Olivier')
    assert olivier_data['id'] == 1
    assert olivier_data['name'] == 'Olivier'

```

Avec la fonction `teardown_module` on exécute du code lorsque les tests sont terminés (pour fermer la connexion avec une BDD par exemple)

Exemple:

```
def teardown_module(module):
	db.close()
```

<br/>

**Option 2: Avec des Fixtures avec un scope module et un générateur**

On peut réécrire le code précédent avec des fixtures.

```
import pytest

@pytest.fixture(scope='module')
def db():
	print("{}setup{}".format("-"*10, "-"*10))
	db = StudentDB()
    db.connect('data.json')
	yield db ## yield is canceled by return 
	print("{}teardown{}".format("-"*10, "-"*10))
	db.close()
    ## implicit return when not specified

def test_olivier_data(db):
    olivier_data = db.get_data('Olivier')
    assert olivier_data['id'] == 1
    assert olivier_data['name'] == 'Olivier'

```

<br/>

## Exécuter les tests en parallèle 

Le paquet suivant est nécessaire:
```
pip install pytest-xdist
```

Puis pour exécuter les tests en parallèle, il faut spécifier l'option suivante au module pytest:

```
python -m pytest -v tests/ -n auto

# ou python -m pytest -v tests/ -n 2
```

<br/>

## Ajouter du code coverage

Installer le paquet suivant:
```
pip install pytest-cov
```

Puis exécuter la commande:
```
python -m pytest -v --cov=path_to_analyze_coverage
```

<br/>

## Configuration files

- pytest.ini (permet par exemple de définir le rootdir des tests)

- conftest.py (exécuté automatiquement, c'est un bon endroit pour écrire des fixtures)

<br/>

## Useful commands:

**Run last failing test:**

```
python -m pytest -v --lf

# ou pytest -v --lf
```

<br/>

**Display print statements:**

```
python -v -s

# ou pytest -v -s
```

<br/>

**Run one specific test:**

```
python -m pytest -v -k "nom_du_test_complet_ou_regex"

# ou pytest -v -k "nom_du_test_complet_ou_regex"

# Or est également possible
# ou pytest -v -k "regex1 or regex2"

# And est également possible
# ou pytest -v -k "regex1 and regex2"
```

<br/>

**Run one specific test in a particular file:**

```
python -m pytest -v mon_fichier_de_test::nom_du_test

# ou pytest -v mon_fichier_de_test::nom_du_test
```

<br/>

**Run one test file:**

```
python -m pytest -v tests/votre_fichier_de_test.py

# ou pytest -v tests/votre_fichier_de_test.py
```

<br/>

**Stopper l'exécution des tests dès la première failure:**

```
python -m pytest -v -x

# ou pytest -v -x
```

<br/>

**Stopper l'exécution des tests après x failed tests:**

```
python -m pytest -v --maxfail=2

# ou pytest -v --maxfail=2
```


Voir les commandes disponibles: https://docs.pytest.org/en/latest/usage.html


<br/>

## Cool Pytest plugins

| PLUGIN   |      DESCRIPTION      |
|----------|:-------------:|
| pytest-server-fixtures | Extensible server-running framework with a suite of well-known databases and webservices included: mongodb, redis, rethinkd, Jenkins, Apache httpd, Xvfb |
| pytest-shutil | Unix shell and environment management tools |
| pytest-profiling | Profiling plugin with tabular heat graph output and gprof support for C-Extensions |
| pytest-devpi-server | DevPI server runnning fixture for testing package management code |
| pytest-pyramid-server | Pyramid server fixture for running up servers in integration tests |
| pytest-webdriver | Selenium webdriver fixture for testing web applications |
| pytest-virtualenv | Create and teardown virtual environments, run tests and commands in the scope of the virtualenv |
| pytest-qt-app | PyQT application fixture |
| pytest-listener | TCP Listener/Reciever for testing remote systems |
| pytest-git | Git repository fixture |
| pytest-svn | SVN repository fixture |
| pytest-fixture-config | Configuration tools for Py.test fixtures |
| pytest-verbose-parametrize | Makes py.test’s parametrize output a little more verbose |

<br/>

## Tricks

**Créer et importer des *helper functions* dans les tests sans créer de package dans le dossier `tests`**

Par exemple, vous voulez créer ceci:

```
# Dans le fichier common.py
def assert_nimporte_quoi_entre_deux_proprietes(x, y):
    assert ...


# Dans tests/my_test.py
def test_something_with(x):
    some_value = some_function_of_(x)
    assert_nimporte_quoi_entre_deux_proprietes(x, some_value)

```


Créer un dossier `helpers` dans le répertoire `tests` et ajouter le path de ce dernier via `pythonpath` dans le fichier `conftest.py`.

```
tests/
    helpers/
      utils.py
      ...
    conftest.py
setup.cfg
```

Dans le fichier `conftest.py`:

```
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'helpers'))
```

Dans le fichier `setup.cfg`:

```
[pytest]
norecursedirs=tests/helpers
```

Ce module sera accessible via `import utils`.

<br/>

**Avoir des modules de tests qui ont le même nom**

Pour ce faire, il faut ajouter un fichier `__init__.py` dans le dossier `tests` ainsi que dans ses sous-répertoires. (Le répertoire `tests`devient donc un module):

```
setup.py
mypkg/
    ...
tests/
    __init__.py
    foo/
        __init__.py
        test_view.py
    bar/
        __init__.py
        test_view.py

```

Maintenant pytest va charger les modules comme ceci: `tests.foo.test_view` et `tests.bar.test_view`
Cela permet d'avoir des modules qui ont le même nom.

<br/>

**Organiser un grand nombre de fixtures**

On peut par exemple ajouter les lignes suivantes dans le fichier `tests/unit/conftest.py`:

```
pytest_plugins = [
   "tests.unit.fixtures.some_stuff",
]
```

Et un fichier de fixture `tests/unit/fixtures/some_stuff.py` peut être défini ainsi: 

```
import pytest

@pytest.fixture
def foo():
    return 'foobar'

```

(Il faudra également créer un fichier `__init__.py`)

<br/>

## Outils 

- Reporting: [Allure](http://allure.qatools.ru/)

