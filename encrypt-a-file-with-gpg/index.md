# Encrypt a file with GPG

- Canonical URL: https://leandeep.com/encrypt-a-file-with-gpg/
- Author: Olivier Eeckhoutte
- Published: 2023-09-24T22:13:00Z
- Updated: 2023-09-24T22:13:00Z
- Language: fr
- Tags: GPG, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Tiny/Pico tip explaining how to encrypt a file using GPG to share it with one of your colleague or friend. 

We start by checking if our friend key is aleady registered in our system using the following command: 

```
gpg --list-public-keys
```

<br/>

If it's ok we just have to execute the following command to encrypt our file to share it securly to our friend:

```
gpg --encrypt --recipient your_friend@email.com secret_file_to_encrypt.txt 
```

<br/>

And voila that's all.


