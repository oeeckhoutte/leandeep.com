# Mesurer le temps de réponse d'un curl

- Canonical URL: https://leandeep.com/mesurer-le-temps-de-r%C3%A9ponse-dun-curl/
- Author: Olivier Eeckhoutte
- Published: 2015-01-02T10:59:00Z
- Updated: 2015-01-02T10:59:00Z
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Petit tip de 2 seconds montrant comment afficher le temps de réponse d'une request via `CURL`

```
curl -X 'GET' \
  'https://...' \
  -H 'accept: application/json' \
  -s -o /dev/null -w "\n\n--> %{time_starttransfer} seconds\n"
```
