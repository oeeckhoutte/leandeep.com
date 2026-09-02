# Installer Jupyter lab sur Ubuntu 22

- Canonical URL: https://leandeep.com/installer-jupyter-lab-sur-ubuntu-22/
- Author: Olivier Eeckhoutte
- Published: 2025-07-19T10:59:00+02:00
- Updated: 2025-07-19T10:59:00+02:00
- Language: fr
- Tags: Machine Learning, python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article très court, nous allons voir comment installer Jupyter lab sur Ubuntu 22.

`Attention cette installation n'est pas sécurisée. C'est de l'ultra temporaire à ne surtout pas utiliser en entreprise et encore moins avec des données de prod.`

<br/>

## Pré-requis

* miniconda3-3.11-23.5.0-3
* nvidia-smi pour vérifier que vous avez accès à un GPU

<br/>

## Installation

```
pip install notebook jupyterlab jupyter
```

<br/>

## Configuration

```
jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root
```

<br/>

Et voilà, rendez-vous sur `http://VOTRE_SERVER:8888/lab?token=MOT_DE_PASSE` pour accéder à Jupyter lab.

`Attention, encore une fois, cette installation n'est pas secure!`
