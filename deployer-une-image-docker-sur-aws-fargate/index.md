# Deployer une image Docker sur AWS Fargate

- Canonical URL: https://leandeep.com/deployer-une-image-docker-sur-aws-fargate/
- Author: Olivier Eeckhoutte
- Published: 2019-05-07T21:17:00Z
- Updated: 2019-05-07T21:17:00Z
- Language: fr
- Tags: AWS, Fargate, Docker
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici la procédure pour déployer des containers Docker sur Fargate. 

<br/>

## Rôle ecsTaskExecutionRole

Vérifier l'existance de ce rôle dans l'IAM.
S'il n'existe pas, il faut le créer:

Créer un fichier appelé `task-execution-assume-role.json` avec ce contenu:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Créer une tâche d'exécution de rôle:

```
aws iam --region eu-west-1 create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://task-execution-assume-role.json
```

Attacher la tâche d'exécution de rôle:

```
aws iam --region eu-west-1 attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

<br/>

## Configurer AWS cli et ecs cli

```
# Pour OSX
brew upgrade amazon-ecs-cli
brew upgrade awscli

rm -rf ~/.ecs # ou mv ~/.ecs ...

export PROJECT_NAME=xxxxxxxxxxxxx

# Création d'un profil
ecs-cli configure profile --access-key $AWS_ACCESS_KEY_ID --secret-key $AWS_SECRET_ACCESS_KEY --profile-name $PROJECT_NAME
```

<br/>

## Création d'un cluster 

```
ecs-cli configure --cluster $PROJECT_NAME --region eu-west-1 --default-launch-type FARGATE --config-name $PROJECT_NAME

ecs-cli up
```

Output:

```
...
VPC created: vpc-xxxxxxxxxx
Subnet created: subnet-xxxxxxxxx
Subnet created: subnet-xxxxxxxxx
Cluster creation succeeded.
```

<br/>

## Création d'un securitygroup

```
export VPC_ID="vpc-xxxxxxxxxxxxxxxxxxx"

# securitygroup name
export SG_NAME="xxxxxxxxxxxxx-sg"

export SG_DESCRIPTION="xxxxxxxxxx xxxxxx xxx security group"

aws ec2 create-security-group --group-name $SG_NAME --description $SG_DESCRIPTION --vpc-id $VPC_ID
```

Output:

```
{
    "GroupId": "sg-xxxxxxxxxxxxxxx"
}
```

<br/>

## Création règle Ingress

```
export SG_GROUP_ID="sg-xxxxxxxxxxxxxxxxx"

aws ec2 authorize-security-group-ingress --group-id $SG_GROUP_ID --protocol tcp --port 8080 --cidr 0.0.0.0/0
```

<br/>

## Configuration Docker et Ressources 

Créer un fichier `docker-compose.yml`

```
version: '3'
services:
  SERVICE_NAME_IE_WP:
    image: IMAGE_DOCKER
    ports:
      - "8080:8080"
    logging:
      driver: awslogs
      options: 
        awslogs-group: PROJECT_NAME
        awslogs-region: eu-west-1
        awslogs-stream-prefix: SERVICE_NAME_IE_WP

```

Créer un fichier `ecs-params.yml`:

```
version: 1
task_definition:
  task_execution_role: ecsTaskExecutionRole
  ecs_network_mode: awsvpc
  task_size:
    mem_limit: 0.5GB
    cpu_limit: 256
run_params:
  network_configuration:
    awsvpc_configuration:
      subnets:
        - "subnet-xxxxxxxxxxxxxxxxx"
        - "subnet-xxxxxxxxxxxxxxxxx"
      security_groups:
        - "sg-xxxxxxxxxxxxxxxxxx"
      assign_public_ip: ENABLED

```

<br/>

## Déploiement sur Fargate:

```
ecs-cli compose --project-name $PROJECT_NAME service up --create-log-groups --cluster-config $PROJECT_NAME
```

Pour updater le container, il suffit de réexécuter la commande ci-dessus. Une nouvelle version de la task déployée se créera et l'ancienne sera éteinte.

> Note: Pour ajouter une instance RDS et l'utiliser dans le container, le plus simple est de créer l'instance RDS dans le VPC du container. Puis il faudra créer une rêgle dans le securitygroup créé précédemment et réutilisant la commande suivante: ` aws ec2 authorize-security-group-ingress --group-id $SG_GROUP_ID --protocol tcp --port 5432 --cidr 0.0.0.0/0`

Rien de plus simple et le tarif est intéressant: https://aws.amazon.com/fr/fargate/pricing/

<br/>

## Troubleshooting

**Restart task:**

> Attention l'IP publique sera modifiée.

```
export SERVICE_NAME=xxxx
export CLUSTER_NAME=xxxx

aws ecs update-service --force-new-deployment --cluster $CLUSTER_NAME --service $SERVICE_NAME
```

<br/>

## Tip: Useful bash functions

```
stop_running_tasks() {
    tasks=$(aws ecs list-tasks --cluster $CLUSTER --service $SERVICE | $JQ ".taskArns | . []");
    tasks=( $tasks )
    for task in "${tasks[@]}"
    do
        [[ ! -z "$task" ]] && stop_task=$(aws ecs stop-task --cluster $CLUSTER --task "$task")
    done
}

push_ecr_image(){
    echo "Push built image to ECR"
    eval $(aws ecr get-login --region us-east-1)
    docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/repository:$TAG
}

configure_aws_cli(){
    aws --version
    aws configure set default.region us-east-1
    aws configure set default.output json
}

start_tasks() {
    start_task=$(aws ecs start-task --cluster $CLUSTER --task-definition $DEFINITION --container-instances $EC2_INSTANCE --group $SERVICE_GROUP --started-by $SERVICE_ID)
    echo "$start_task"
}
```

