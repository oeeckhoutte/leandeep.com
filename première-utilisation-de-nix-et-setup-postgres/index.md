# Première utilisation de Nix et setup Postgres

- Canonical URL: https://leandeep.com/premi%C3%A8re-utilisation-de-nix-et-setup-postgres/
- Author: Olivier Eeckhoutte
- Published: 2025-07-02T22:32:00+02:00
- Updated: 2025-07-02T22:32:00+02:00
- Language: fr
- Tags: Nix, DevOps
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Petite précision, c'est un setup sur Mac avec processeur ARM. La version de Nix est `2.29.1`.

## Setup Nix sur OSX

```
sh <(curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install)
source ~/.zshrc
mkdir ~/.config/nix
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

> Remarque: sur Ubuntu, l'installer avec `sh <(curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install) --daemon`.

<br/>

## Setup PG

Créer un fichier `nix/flake.nix` dans votre repo git et ajouter le contenu suivant:

**Option 1**
```
{
  description = "Environnement de développement PostgreSQL";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: 
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.postgresql
          ];
          shellHook = ''
            export setup_postgres=${pkgs.postgresql}/bin/initdb
          '';
        };
      });
}
```

<br/>

**Option 2 (avec démarrage du serveur automatique)**

> Chaque fois que `nix develop` sera démarré dans votre repo dans le dossier `nix`,
le shell va s’ouvrir avec PostgreSQL installé et il va automatiquement lancer le serveur PostgreSQL (si la base est initialisée).

```
{
  description = "Environnement de développement PostgreSQL";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.postgresql
          ];
          shellHook = ''
            export setup_postgres=${pkgs.postgresql}/bin/initdb

            # Démarrage automatique de PostgreSQL si le dossier est initialisé
            if [ -d "$PWD/var/pgdata/base" ]; then
              echo "⏳ Démarrage de PostgreSQL..."
              pg_ctl -D $PWD/var/pgdata -l $PWD/var/pglog start
            else
              echo "⚠️  PostgreSQL n'est pas encore initialisé. Lancez :"
              echo "   $setup_postgres $PWD/var/pgdata"
            fi
          '';
        };
      });
}
```

<br/>

**Option 3 (start & stop automatique à l'entrée et sortie de `nix develop`)**

```
{
  description = "Environnement de développement PostgreSQL";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.postgresql
          ];
          shellHook = ''
            export setup_postgres=${pkgs.postgresql}/bin/initdb

            # Démarrage automatique si base initialisée
            if [ -d "$PWD/var/pgdata/base" ]; then
              echo "⏳ Démarrage de PostgreSQL..."
              pg_ctl -D $PWD/var/pgdata -l $PWD/var/pglog start

              # À la sortie du shell, arrêter PostgreSQL
              trap "echo '🛑 Arrêt de PostgreSQL...'; pg_ctl -D $PWD/var/pgdata stop" EXIT
            else
              echo "⚠️  PostgreSQL n'est pas encore initialisé. Lancez :"
              echo "   $setup_postgres $PWD/var/pgdata"
            fi
          '';
        };
      });
}
```

<br/>

```
cd nix
nix develop
$setup_postgres $PWD/var/pgdata
/nix/store/smngl7zwd4mcz426w18p7lnx08m52im0-postgresql-17.5/bin/pg_ctl -D /Users/.../nix/var/pgdata -l logfile start
createdb olivier
```

<br/>

**Vérification (connexion à PG)**

```
psql -h localhost -p 5432 -U $USER
```

<br/>


## Stopper le serveur PG

```
nix develop
pg_ctl -D $PWD/var/pgdata stop
```

> Attention le serveur tourne en mode dev:
> `initdb: warning: enabling "trust" authentication for local connections`
> PostgreSQL autorise toutes les connexions locales sans mot de passe. En production, on peut modifier le fichier `var/pgdata/pg_hba.conf` et changer trust en md5 pour obliger une authentification avec mot de passe

<br/>

## Incompatibilité Mac M2

```
NIXPKGS_ALLOW_UNSUPPORTED_SYSTEM=1 nix develop --impure
```

<br/>

## Cleanup complet (pas uninstall)

```
nix store gc
```

