# Remote access to termux from OSX

- Canonical URL: https://leandeep.com/remote-access-to-termux-from-osx/
- Author: Olivier Eeckhoutte
- Published: 2024-03-01T00:13:00Z
- Updated: 2024-03-01T00:13:00Z
- Language: fr
- Tags: Android, Tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Open Termux on Android and then execute the following commands:

```
pkg upgrade
pkg install openssh
passwd
whoami
sshd -e -d -d -d
```

On OSX:

```
# ssh username@<android_ip> -p8022
# ssh u0_412@<........> -p8022
```

To kill the server:
```
pkill sshd
```



> sshd: no hostkeys available -- exiting
> `ssh-keygen -A`

Bonus 
```
pkg install termux-api
```
