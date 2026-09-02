# Get rid of .pem file to SSH on your AWS EC2 instance

- Canonical URL: https://leandeep.com/get-rid-of-.pem-file-to-ssh-on-your-aws-ec2-instance/
- Author: Olivier Eeckhoutte
- Published: 2019-09-06T11:39:00Z
- Updated: 2019-09-06T11:39:00Z
- Language: fr
- Tags: AWS, Gitlab, Git, pem, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Let's say you want to setup a Gitlab server on AWS and you need to do a `git clone` using `SSH` protocol. You will be annoyed by the `.pem` file. To get rid of it (or more simply hide it) you can follow this procedure:

The pem file contains a private key. Simply extract it and add it to your system. 

<br/>
**Copy the private key to the .ssh folder**
```
cp /path/to/your/cert.pem ~/.ssh/id_rsa_gitlab_ec2
```

<br/>

**Generate a public key from the .pem file**
```
ssh-keygen -y -f /path/to/your/cert.pem > ~/.ssh/id_rsa_gitlab_ec2.pub
```

<br/>

**Change private key file rights**
```
chmod 600 ~/.ssh/id_rsa_gitlab_ec2
```

<br/>

**Add the private key to ssh-agent**

```
# Start ssh-agent
eval "$(ssh-agent -s)"

# Add your newly created key to the agent
ssh-add ~/.ssh/id_rsa_gitlab_ec2
```

<br/>

**Now try to connect to you EC2 instance via SSH**
```
ssh your_user@ec2-ip......amazonaws.com
```

<br/>

Try to `git clone ...`. All good !

