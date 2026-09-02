# Identify path to stop docker compose

- Canonical URL: https://leandeep.com/identify-path-to-stop-docker-compose/
- Author: Olivier Eeckhoutte
- Published: 2025-04-28T23:40:00Z
- Updated: 2025-04-28T23:40:00Z
- Language: fr
- Tags: Unix Tip, Docker, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Very quick tip on how to identify the directory from which a `docker compose` command was launched (as the standard docker ps output doesn't show it).

```
# Retrieve container ID
docker ps 

docker inspect \
  --format='{{ index .Config.Labels "com.docker.compose.project.working_dir" }}' \
  0e6194178cf0
/Users/olivier/Dev/Leandeep/Rust/test_app/leptos_pg
```

