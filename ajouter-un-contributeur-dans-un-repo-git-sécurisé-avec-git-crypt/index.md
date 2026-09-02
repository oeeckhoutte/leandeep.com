# Ajouter un contributeur dans un repo git sécurisé avec git-crypt

- Canonical URL: https://leandeep.com/ajouter-un-contributeur-dans-un-repo-git-s%C3%A9curis%C3%A9-avec-git-crypt/
- Author: Olivier Eeckhoutte
- Published: 2020-01-10T19:49:00+02:00
- Updated: 2020-01-10T19:49:00+02:00
- Language: fr
- Tags: Git
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Pré-requis
Installer `GPG` et `git-crypt` localement

<br/>

**Sur OSX:**
```
brew install gpg
brew install git-crypt
```

<br/>

**Sur Linux Ubuntu/ Debian:**
```
apt-get install gnupg git-crypt gnupg-agent -y
```

<br/>

## Verification de l'installation
```
gpg --gen-key
gpg --list-keys
```

Generate a new GPG key 
On the new developer laptop execute:

<br/>

## Generate a new GPG key

```
gpg --gen-key
```

<br/>

## Get the public key ID

Send the key to an admin to trust it and add it to git-crypt repo DB
```
gpg --list-keys
# example 4037B9596FB8CF790CF5D2BB66281416CB86764B
```


<br/>

## Export the GPG keys to a file
```
# If your machine contains one GPG key
gpg --armor --export --output /tmp/user_pubkey.gpg

# Else
gpg --export -a CEDFA26469..................CEC966794F8D > /tmp/olivier_pubkey.gpg
```
Send to file to a repository contributor/ admin.


<br/>

## Import the public key locally

On the admin laptop import the public key to GPG local DB and trust it.
```
gpg --import /tmp/user_pubkey.gpg

# Trust the public key
gpg --edit-key F987DFB4E7F6B40A03FC152A3C3B8C1BDB3C11EF trust quit
5 
y
```

<br/>

## Add the trusted key on git repo
On the admin laptop add the public key to the repo (it automatically creates a commit)
```
git-crypt add-gpg-user 4037B9596FB8CF990CF5D2BB66281416CB86764B
# Replace the example key bellow with the new developer key: example 4037B9596FB8CF790CF5D2BCC3281416CB86764B
``` 

<br/>

## Push the change to git
Just git push. On the previous step a commit has been automatically created (git log to see it)

