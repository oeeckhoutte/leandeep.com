# Damn! Toujours pas d’HTTPS…

- Canonical URL: https://leandeep.com/damn-toujours-pas-dhttps/
- Author: Olivier Eeckhoutte
- Published: 2018-08-06T23:11:00Z
- Updated: 2018-08-06T23:11:00Z
- Language: fr
- Tags: Docker
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Honte à moi, je passe mon temps à jouer avec des serveurs et je n'ai toujours pas configuré d'HTTPS pour mon blog.
Il fallait que je prenne un peu de temps pour rétablir la situation... J'en profite pour écrire rapidement cet article.  

<br/>

Voici comment j’ai fait pour avoir un certificat HTTPS gratuit pour mon blog en moins de 5 minutes top chrono. 

Avant, sans HTTPS, pour démarrer ce blog j’exécutais la commande suivante: 

```
docker run -d --restart=always -e url=http://leandeep.com -e NODE_ENV=production --name some-ghost-v2 -v /var/lib/ghost:/var/lib/ghost/content -p 80:2368 ghost
```

C’était plutôt simple et efficace. En effet, je n’ai jamais dû intervenir sur le serveur depuis avril 2015. (Enfin jamais sauf une fois pour upgrader l'OS et passer à Ubuntu 16.04 . Mais c'est un autre sujet) 

<br/>

Aujourd’hui, pour avoir un certificat HTTPS simplement, je vais utiliser Nginx comme reverse proxy. Ce dernier portera le certificat. 

Pour utiliser Nginx, je vais passer par Docker. C'est beaucoup plus rapide et propre que faire des apt-get install nginx... Et pour me simplifier la vie, je vais utiliser un docker-compose puisque j’aurais plus d’un container à gérer sur ce serveur. 

<br/>

Voici ci-dessous à quoi ressemble mon docker-compose.yml. Vous verrez que j'utilise 2 projets opensource que je vous invite à consulter sur Github: https://github.com/jwilder/nginx-proxy et https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion. C'est grâce à ces projets que mes certificats se génèrent tout seul et que je peux avoir des HTTPS pour mes nouveaux projets sans rien faire.

```
version: '3.1'
services:
  nginx-proxy:
    image: jwilder/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./nginx/certs:/etc/nginx/certs:ro
      - ./nginx/vhost.d:/etc/nginx/vhost.d
      - nginx.html:/usr/share/nginx/html
    labels:
      com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy: "true"
  nginx-proxy-companon:
    image: jrcs/letsencrypt-nginx-proxy-companion
    depends_on:
      - "nginx-proxy"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./nginx/certs:/etc/nginx/certs:rw
      - ./nginx/vhost.d:/etc/nginx/vhost.d
      - nginx.html:/usr/share/nginx/html
    environment:
      - NGINX_PROXY_CONTAINER=nginx-proxy
  ghost:
    image: ghost:1-alpine
    restart: always
    depends_on:
      - "nginx-proxy"
    ports:
      - 127.0.0.1:8080:2368
    volumes:
      - ./blog:/var/lib/ghost/content
    environment:
      - url=https://leandeep.com
      - VIRTUAL_HOST=leandeep.com
      - LETSENCRYPT_HOST=leandeep.com
      - LETSENCRYPT_EMAIL=<mon_email>
  staticweb:
    image: nginx:alpine
    depends_on:
      - "nginx-proxy"
    ports:
      - 127.0.0.1:8081:80
    volumes:
      - ./staticweb:/usr/share/nginx/html:ro
    environment:
      - url=https://www.leandeep.com
      - VIRTUAL_HOST=www.leandeep.com
      - LETSENCRYPT_HOST=www.leandeep.com
      - LETSENCRYPT_EMAIL=<mon_email>
volumes:
  nginx.html:
```

Comme vous pouvez le voir, ce docker-compose définit 2 sites: https://leandeep.com et https://www.leandeep.com.
Le premier renvoie vers un blog Ghost et le deuxième vers un dossier statique servi par Nginx. 

<br/>

Avant de faire un docker-compose up -d , j’ai créé 2 dossiers pour chacun des 2 sites web.
Le premier dossier blog/ contient le contenu de mon blog Ghost https://leandeep.com. Il contient donc l’arborescence suivante: 

```
apps/
data/
images/
logs/
settings/
themes/
```

<br/>

Le deuxième dossier staticweb/ pour le site internet https://www.leandeep.com contient une simple page HTML qui redirige vers https://leandeep.com via ces 3 lignes de code: 
```
<script>
window.location.href = 'https://leandeep.com';
</script>
```

> A la place de cette redirection bête et méchante, on pourrait avoir un tout autre site internet bien plus intéressant. Ici c’est une redirection que j’ai laissé volontairement à titre d'exemple pour montrer comment avoir plusieurs sites web avec cet unique docker-compose. 

<br/>

Enfin, pour générer le certificat, il faudra créer un fichier ./nginx/vhost.d/leandeep.com qui contiendra la configuration pour let's encrypt: 

```
## Start of configuration add by letsencrypt container
location ^~ /.well-known/acme-challenge/ {
    auth_basic off;
    allow all;
    root /usr/share/nginx/html;
    try_files $uri =404;
    break;
}
## End of configuration add by letsencrypt container
add_header X-Frame-Options "SAMEORIGIN";
add_header Content-Security-Policy "script-src 'self' 'unsafe-inline' https://code.jquery.com";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "no-referrer-when-downgrade";
server_tokens off;
```

<br/>

Voilà. Il n'y a plus qu'à lancer le docker-compose avec la commande:
```
docker-compose up -d
```


