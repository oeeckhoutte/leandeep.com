# Serverless sur AWS avec SAM

- Canonical URL: https://leandeep.com/serverless-sur-aws-avec-sam/
- Author: Olivier Eeckhoutte
- Published: 2019-08-17T16:51:00Z
- Updated: 2019-08-17T16:51:00Z
- Language: fr
- Tags: AWS, SAM, Serverless
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Si comme moi vous voulez installer AWS SAM pour développer et tester en local vos applications serverless voici la procédure à suivre:

<br/>

## Prérequis

- AWS Cli
- AWS Cli configuré
- Docker (dois-je le préciser ?)
- Python 3

<br/>

## Installation

Créer un bucket S3:
```
aws s3 mb s3://votre-sam-bucket --region eu-west-1
```

Installer AWS SAM Cli:

> AWS recommande l'utilisation de Homebrew pour l'installation de SAM mais je préfère utiliser pip pour ne pas être contraint à passer de Python 3.6 à 3.7.

```
pip install aws-sam-cli
```

Vérifier que SAM est bien installé:

```
sam --version

SAM CLI, version 0.19.0
```

<br/>

## Première application

Créer une application squelette qui aura la structure suivante:
```
sam init --runtime python3.6

sam-app/
   ├── README.md
   ├── event.json
   ├── hello_world/
   │   ├── __init__.py
   │   ├── app.py            # Contains your AWS Lambda handler logic.
   │   └── requirements.txt  # Contains any Python dependencies the application requires, used for sam build
   ├── template.yaml         # Contains the AWS SAM template defining your application's AWS resources.
   └── tests/
       └── unit/
           ├── __init__.py
           └── test_handler.py

```



Builder l'application:
```
cd sam-app
sam build
```


Une fois que l'application a été buildée on peut la packager et l'envoyer sur AWS ou la tester en local.

<br/>

**Option 1: Exécuter la fonction sur AWS**

Packager votre application:
```
sam package --output-template packaged.yaml --s3-bucket votre-sam-bucket
```

Déployer votre application:
```
sam deploy --template-file packaged.yaml --region eu-west-1 --capabilities CAPABILITY_IAM --stack-name aws-sam-getting-started
```

<br/>

**Option 2: Exécuter la fonction en local**

2 options s'offrent à nous pour tester notre fonction lambda en local. On peut simuler une API REST qui appelera notre fonction si le bon endpoint est appelé ou on peut directement invoquer la fonction lambda via le cli.

<br/>

**Option 2.1: Simuler une API REST**

Dans un premier terminal lancer l'API:
```
sam local start-api
```

Puis dans un second terminal exécuter la commande suivante: 
```
curl http://127.0.0.1:3000/hello

{"message": "hello world"}%
```

<br/>

**Option 2.2: Invoquer la fonction directement***

```
sam local invoke "HelloWorldFunction" -e event.json

{"statusCode": 200, "body": "{\"message\": \"hello world\"}"}
```

<br/>

## Events

Il est possible de simuler ses events AWS. [L'article suivant](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-generate-event.html) décrit comment faire.


Examples: 

* Simuler un event S3:
```
sam local generate-event s3 [put/delete] --bucket <bucket> --key <key> > s3-event.json
```
* Simuler un event sur AWS API Gateway:

```
sam local generate-event apigateway aws-proxy --body "" --path "hello" --method GET > api-event.json
```

* Simuler un event SNS:

```
sam local generate-event sns notification --message \"$(cat event.json)\" | sam local invoke MyAwesomeLambda

# contenu de event.json:
{
  "foo": "bar"
}
```

* Simuler un event et invoquer directement la lambda:
  
```
sam local generate-event s3 [put/delete] --bucket <bucket> --key <key> | sam local invoke <function logical id>
```

<br/>  

## Exemples d'applications SAM

AWS fourni [un grand nombre d'examples d'applications](https://github.com/awslabs/serverless-application-model/tree/master/examples/apps).


<br/>

## Debug

Avec remote_pdb, puisque SAM est basé sur Docker.
Dans votre code, ajoutez le snippet suivant là où vous voulez debugguer:
```
__import__(remote_pdb).RemotePdb('0.0.0.0', 5858).set_trace()
```

Puis, une fois votre container lancé soit par invocation d'événement ou soit par la fonctionnalité API lancez le debugger avec la commande `telnet localhost 5858`.

