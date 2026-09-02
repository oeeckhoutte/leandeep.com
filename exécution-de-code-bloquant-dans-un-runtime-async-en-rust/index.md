# Exécution de code bloquant dans un runtime async en Rust

- Canonical URL: https://leandeep.com/ex%C3%A9cution-de-code-bloquant-dans-un-runtime-async-en-rust/
- Author: Olivier Eeckhoutte
- Published: 2023-02-03T21:19:00Z
- Updated: 2023-02-03T21:19:00Z
- Language: fr
- Tags: Rust
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction 

Dans cet article nous allons voir comment exécuter du code bloquant dans un runtime async en Rust.

<br/>

## Schéma visuel
```
Thread principal (async)                    Thread bloquant
     |                                           |
     | spawn_blocking() -----------------------> |
     |   (retourne immédiatement)                |
     |                                           | get_btc_stablecoin_pairs_sync()
     | .await                                    | (appel synchrone à Binance)
     |   (attend sans bloquer)                   |
     |                                           | (traitement...)
     | <--------------------------------------- |
     |   (résultat reçu)                        |
     |                                           |
     | .map_err() - gère JoinError              |
     | .map_err() - gère erreur métier          |
     |                                           |
     v                                           v

```

<br/>

## Example de code

```    
let btc_pairs = tokio::task::spawn_blocking(get_btc_stablecoin_pairs_sync)
    .await
    .map_err(|e| format!("Task join error: {}", e))?
    .map_err(|e| format!("Error getting pairs: {}", e))?;
```

<br/>

**Equivalent avec annotations:**

> Décomposition étape par étape

```
pub async fn stream_btc_stablecoin_pairs() -> Result<(), Box<dyn std::error::Error>> {
    log::info!("Fetching BTC/stablecoin pairs...");
    
    // 1. Spawner un thread bloquant (retourne JoinHandle immédiatement)
    let join_handle = tokio::task::spawn_blocking(get_btc_stablecoin_pairs_sync);
    
    // 2. Attendre le résultat du thread (async, ne bloque pas le runtime)
    let join_result: Result<Result<Vec<String>, String>, JoinError> = join_handle.await;
    
    // 3. Gérer l'erreur de join (si le thread a paniqué)
    let inner_result: Result<Vec<String>, String> = join_result
        .map_err(|e| format!("Task join error: {}", e))?;
    
    // 4. Gérer l'erreur métier (si l'API a échoué)
    let btc_pairs: Vec<String> = inner_result
        .map_err(|e| format!("Error getting pairs: {}", e))?;
    

    
    // Reste du code...
    log::info!("Found {} BTC/stablecoin pairs", btc_pairs.len());
    // ...
}

```

<br/>

**Ce qu'il s'est passé étape par étape:**


1. **`tokio::task::spawn_blocking(get_btc_stablecoin_pairs_sync)`**
   - Lance la fonction `get_btc_stablecoin_pairs_sync` dans un **thread dédié aux opérations bloquantes**
   - Retourne immédiatement un `JoinHandle<Result<Vec<String>, String>>`
   - Cette fonction ne bloque pas le runtime async

2. **`.await`**
   - On attend (de manière async) que le thread bloquant termine
   - Pendant ce temps, le runtime tokio peut exécuter d'autres tâches
   - Retourne `Result<Result<Vec<String>, String>, JoinError>`
   - Le premier `Result` vient du `.await` (erreur de join)
   - Le second `Result` vient de notre fonction (erreur métier)

3. **Premier `.map_err(...)?`**
   - Gère l'erreur de `JoinError` (si le thread a paniqué)
   - Transforme `Result<Result<Vec<String>, String>, JoinError>` en `Result<Vec<String>, String>`

4. **Deuxième `.map_err(...)?`**
   - Gère l'erreur de notre fonction (si l'API Binance a échoué)
   - Transforme le `Result<Vec<String>, String>` en `Vec<String>` ou propage l'erreur


<br/>
## Résumé

* spawn_blocking : "Lance ce code bloquant dans un thread dédié"
* .await : "Attends (sans bloquer) que ce thread termine"
* Les deux .map_err()? : "Gère les deux niveaux d'erreurs possibles"
