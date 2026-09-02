# Custom Python Packages with AWS lambda and CDK

- Canonical URL: https://leandeep.com/custom-python-packages-with-aws-lambda-and-cdk/
- Author: Olivier Eeckhoutte
- Published: 2019-06-18T21:27:00Z
- Updated: 2019-06-18T21:27:00Z
- Language: fr
- Tags: Python, AWS, AWS CDK, AWS Lambda
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

The purpose of this article is to describe how to execute Python code with custom packages on **AWS Lambda**. Since there is no way to execute a `pip install` on lambda when you use the inline code feature you cannot use external packages. So you are very limited. 
Fortunately there is a work around (as usual with AWS). You can package your app with its dependences in a zip file and upload it directly on Lambda. If you use a deployment script (.sh or Makefile) and **AWS CDK** like I do it becomes very easy to make Lambda execute any Python code. 

<br/>

## Docker

I use Docker and an `Amazon AMI Linux` base image to build everything. At least I am sure that everything I build fits the target execution environment (AWS Lambda).

Dockerfile example: 

```
FROM amazonlinux:latest

RUN yum update -y 
RUN yum install -y gcc-c++ pkgconfig python3-devel redhat-rpm-config python3-pip

RUN mkdir -p /app
ADD requirements-prod.txt /app/requirements.txt
ADD my_script.py /app

WORKDIR /app
RUN pip3 install -t . -Ur requirements.txt
RUN zip -r zip.zip . 

CMD python3 my_script.py
```

I use this Docker image to deploy on AWS Lambda and also run my Python script locally if neccessary. 
As you can see the pip dependences are installed in the current directory /app and everything is zipped to be deployed on AWS Lambda.

<br/>

## Deployment 

With few basic commands and a CDK script it becomes handy to automate the whole deployment of your AWS infrastructure and create a Lambda function that will use your previously generated zip file containing your Python code with custom dependences.  

Here is an example of deployment script you can write:

```
# Create the Docker image based on Amazonlinux
docker build -t lambda-function .

# Verify the function works and creates a container to produce a zip file
docker run -it lambda-function

# Get the last container ID
container_id=`docker ps --last 1 --format "{{.ID}}"`

# Print the last container ID
echo $container_id

# Copy the zip.zip file from the Docker container to the host
docker cp $container_id:/app/zip.zip .

# Deploy the AWS infra with AWS Lambda function. The latter will use the zip.zip file located inside the current directory of the host
cdk deploy --require-approval=never 
```

Here is a CDK script example to deploy an AWS Lambda function with a zip file. In the following example the zip file is located locally. It could have been located in AWS S3.

> I use the package version 0.31.0 for aws-cdk.aws-lambda and aws-cdk.cdk

```
from aws_cdk import (
    aws_lambda as lambda_,
    cdk,
)

class BonjourExampleLambda(cdk.Stack):
    def __init__(self, scope: cdk.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, *kwargs)
        
		lambdaFn = lambda_.Function(
    		self,
		    "exampleLambda",
		    code=lambda_.Code.asset("zip.zip"),
		    handler="my_script.main_function_to_call",
		    timeout=30,
		    runtime=lambda_.Runtime.PYTHON37,
            tracing=lambda_.Tracing.Active,
		)
  
app = cdk.App()
BonjourExampleLambda(app, "Example-lambda-cdk")
app.run()

```


> If some of your dependences require shared objects (`*.so` files) to work you can also create one or few "Layer(s)" that contain the `*.so` files. AWS Lambda will use them and your dependences should work. 

<br/>

## Conclusion

**Firstly use AWS CDK ! Secondly if you need to execute custom packages on Lambda you can ! Docker is great alternative (with AWS Fargate if you want to manage nothing) but it is not always the best solution. It depends on your team, your skills, your budget and above all your use case...**

Obviously this is a simple example but you could build a pretty cool and modern architecture with these tools. This is especially true if you investigate in the AWS CDK (that use AWS Cloud Formation under the hood)...

