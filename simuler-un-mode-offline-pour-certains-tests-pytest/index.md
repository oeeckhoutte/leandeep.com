# Simuler un mode offline pour certains tests Pytest

- Canonical URL: https://leandeep.com/simuler-un-mode-offline-pour-certains-tests-pytest/
- Author: Olivier Eeckhoutte
- Published: 2024-12-10T23:49:00+02:00
- Updated: 2024-12-10T23:49:00+02:00
- Language: fr
- Tags: Python, tips, pytest
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Pour certains, cet article peut sembler inutile car ils vous diront qu'il suffit de couper le wifi sur son laptop pour ne plus avoir internet. Ce n'est pas faux, mais parfois et sans rentrer dans le détail, il n'est pas toujours possible de travailler offline pendant des heures.

<br/>

Voici donc un tip pour simuler dans des tests unitaires la déconnexion d'internet.
Il suffit de créer la fixture pytest suivante et de l'appeler dans vos tests.

<br/>

En pré-requis, il suffit d'installer le package `pytest-network`.

```
import pytest
import socket

_original_connect = socket.socket.connect


def patched_connect(*args, **kwargs):
    ...
    # It depends on your testing purpose
    # You may want a exception, add here
    # If you test unconnectable situations
    # it can stay like this


@pytest.fixture
def enable_network():
    socket.socket.connect = _original_connect
    yield
    socket.socket.connect = patched_connect


@pytest.fixture
def disable_network():
    socket.socket.connect = patched_connect
    yield
    socket.socket.connect = _original_connect

```

<br/>

Testé et approuvé, très utile en ce qui me concerne.

