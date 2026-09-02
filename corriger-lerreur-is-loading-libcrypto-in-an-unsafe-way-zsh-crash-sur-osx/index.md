# Corriger l'erreur "is loading libcrypto in an unsafe way" zsh crash sur OSX

- Canonical URL: https://leandeep.com/corriger-lerreur-is-loading-libcrypto-in-an-unsafe-way-zsh-crash-sur-osx/
- Author: Olivier Eeckhoutte
- Published: 2022-05-18T22:59:00Z
- Updated: 2022-05-18T22:59:00Z
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici la procédure pour corriger l'erreur qui fait crasher le terminal zsh avec le message d'erreur suivant: `is loading libcrypto in an unsafe way` lors du démarrage de Python (3.9.12 dans mon cas) sur OSX Monterey

J'ai parfois eu cette erreur après avoir bidouillé:
`SystemError: ffi_prep_closure(): bad user_data (it seems that the version of the libffi library seen at runtime is different from the 'ffi.h' file seen at compile-time)`. Bref c'est une erreur Openssl. Il manque une lib dans `/usr/local/lib/`. Le pourquoi du comment il manque cette lib, je n'ai pas eu le temps de creuser. Par contre, exécuter les commandes suivantes a résolu mon problème.


<br/>

```
brew install openssl
ln -s /usr/local/opt/openssl\@3/lib/libcrypto.dylib /usr/local/lib/libcrypto.dylib
ln -s /usr/local/opt/openssl\@3/lib/libssl.dylib /usr/local/lib/libssl.dylib
```


