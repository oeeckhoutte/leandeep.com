# Provisionner un cluster Kubernetes avec AWS EKS

- Canonical URL: https://leandeep.com/provisionner-un-cluster-kubernetes-avec-aws-eks/
- Author: Olivier Eeckhoutte
- Published: 2019-03-07T21:28:00Z
- Updated: 2019-03-07T21:28:00Z
- Language: fr
- Tags: Kubernetes, AWS EKS
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article nous allons voir comment provisionner un cluster simple Kubernetes via AWS EKS. 
Nous verrons dans un prochain article comment mettre en place l'autoscaling et comment faire pour que les nouvelles instances automatiquement crées soient des instances Spot.

<br/>

## Pré-requis

- Compte AWS
- Utilisateur Admin (Policy AdministratorAccess dans IAM)

<br/>

## Installation via Cloud9

1. Créer un nouveau workspace dans Cloud9 <nom_de_votre_projet>

<br/>

2. Depuis Cloud9, via le terminal générer une clé SSH
```
ssh-keygen
```

<br/>

3. Uploader sa clé dans la région EC2
```
aws ec2 import-key-pair --key-name "<nom_de_votre_clé>" --public-key-material file://~/.ssh/id_rsa.pub
```

<br/>

4. Installer les outils Kubernetes

- Créer le répertoire ~/.kube par défaut pour stocker la configuration kubectl

- Installer kubectl

```
sudo curl --silent --location -o /usr/local/bin/kubectl "https://amazon-eks.s3-us-west-2.amazonaws.com/1.11.5/2018-12-06/bin/linux/amd64/kubectl"
sudo chmod +x /usr/local/bin/kubectl
```

- Installer AWS IAM Authenticator

```
go get -u -v github.com/kubernetes-sigs/aws-iam-authenticator/cmd/aws-iam-authenticator
sudo mv ~/go/bin/aws-iam-authenticator /usr/local/bin/aws-iam-authenticator
```

- Vérifier les binaires

```
kubectl version --short --client
aws-iam-authenticator help
```

- Installer JQ

```
sudo yum -y install jq
```

<br/>

5. Créer un rôle IAM pour le workspace Cloud9

- Cliquer sur le lien suivant pour créer un rôle IAM avec accès administator: https://console.aws.amazon.com/iam/home#/roles$new?step=review&commonUseCase=EC2%2BEC2&selectedUseCase=EC2&policies=arn:aws:iam::aws:policy%2FAdministratorAccess

- Vérifier que la police service AWS: ec2.amazonaws.com est bien sélectionnée et cliquer sur Next pour voir les permissions.

- Vérifier qu'AdministratorAccess est bien coché et cliquer sur Next.

- Entrer <nom_de_votre_projet>-admin comme exemple de nom et cliquer sur Create Role.

<br/>

6. Attacher le rôle IAM à votre workspace

- Cliquer sur le lien suivant pour identifier votre instance Cloud9 EC2: https://console.aws.amazon.com/ec2/v2/home?#Instances:tag:Name=aws-cloud9-<nom_de_votre_projet>*;sort=desc:launchTime

- Selectionner votre instance et cliquer sur Actions / Instance Settings / Attach/Replace IAM Role

- Sélectionner <nom_de_votre_projet>-admin dans la drop down IAM Role et cliquer sur Apply.

<br/>

7. Mettre à jour les préférences IAM du workspace

- Retourner dans votre workspace Cloud0 et lancer l'onglet préférences en cliquant en haut à droite sur la roue crantée. 

- Sélectionner AWS SETTINGS

- Décocher AWS managed temporary credentials

- Fermer l'onglet des préférences

<br/>

8. Pour être certain que des credentials n'ont pas déjà été mis en place, exécuter la commande suivante: 
```
rm -vf ${HOME}/.aws/credentials
```

<br/>

9. Configurer l'AWS cli avec la région actuelle:

```
export AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')
echo "export AWS_REGION=${AWS_REGION}" >> ~/.bash_profile
aws configure set default.region ${AWS_REGION}
aws configure get default.region
```

<br/>

10. Valider le rôle IAM


- On va utiliser la commande CLI GetCallerIdentity https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html pour vérifier que Cloud9 utilise le bon rôle IAM.

- On commence par récupérer le rôle IAM du CLI AWS.

```
INSTANCE_PROFILE_NAME=`basename $(aws ec2 describe-instances --filters Name=tag:Name,Values=aws-cloud9-${C9_PROJECT}-${C9_PID} | jq -r '.Reservations[0].Instances[0].IamInstanceProfile.Arn' | awk -F "/" "{print $2}")`
aws iam get-instance-profile --instance-profile-name $INSTANCE_PROFILE_NAME --query "InstanceProfile.Roles[0].RoleName" --output text
```

En sortie on doit obtenir ceci:

```
<nom_de_votre_projet>-admin
```

Comparer le résultat de cette commande avec celle-ci:

```
aws sts get-caller-identity
```

Si l'ARN contient le rôle name comme ci-dessous, tout est bien configuré:

```
{
    "Account": "123456789012", 
    "UserId": "AROA1SAMPLEAWSIAMROLE:i-01234567890abcdef", 
    "Arn": "arn:aws:sts::123456789012:assumed-role/<nom_de_votre_projet>-admin/i-01234567890abcdef"
}
```

<br/>

11. Installer le binaire `eksctl`:

```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp

sudo mv -v /tmp/eksctl /usr/local/bin
```

Et vérifier que l'installation est bonne via:

```
eksctl version
```

<br/>

12. Création du cluster

```
eksctl create cluster --name=<nom_de_votre_projet>-eksctl --nodes=3 --node-ami=auto --region=${AWS_REGION}
```

<br/>

## Vérifier le bon fonctionnement du cluster
```
kubectl get nodes
```

<br/>

## Déployer le dashboard k8s officiel
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml
```

<br/>

15. Accéder au dashboard
```
kubectl proxy --port=8080 --address='0.0.0.0' --disable-filter=true &
```

- Dans Cloud9, cliquer sur Tools / Preview / Preview Running Application. Positionnezvous à la fin de l'URL et ajoutez:
/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/

- Ouvrer un nouvel onglet et entrer la commande suivante pour obtenir un token:

```
aws-iam-authenticator token -i <nom_de_votre_projet>-eksctl --token-only
```

- Enfin cliquer sur Sign In.

