# Extract & resolve geographic entities from unstructured text

- Canonical URL: https://leandeep.com/extract-resolve-geographic-entities-from-unstructured-text/
- Author: Olivier Eeckhoutte
- Published: 2019-07-12T12:07:00Z
- Updated: 2019-07-12T12:07:00Z
- Language: fr
- Tags: Entity Extraction, Geoparsing
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

In this article we are going to see how to install a great opensource tool called `CLAVIN` (Cartographic Location And Vicinity INdexer) that can extract and parse geographic entities from an unstructured text. 
The installation will be done on Ubuntu 18.04. 

Here is an example of what you can do: http://clavin.berico.us/clavin-web/

Here is the description of the tool coming from the official website:

*CLAVIN does not simply “look up” location names – it uses intelligent heuristics to identify exactly which “Springfield” (for example) was intended by the author, based on the context of the document. CLAVIN also employs fuzzy search to handle incorrectly-spelled location names, and it recognizes alternative names (e.g., “Ivory Coast” and “Côte d’Ivoire”) as referring to the same geographic entity.*

<br/>

## Prerequisites

**Install Maven**

Update your system to the latest stable version:

```
sudo apt-get update -y
sudo apt-get upgrade -y
```

Install Java if necessary:

```
sudo apt-get install -y default-jdk
```

Verify it is correctly installed with:

```
java -version
```

Install Maven:
```
cd /opt/
sudo wget https://www-us.apache.org/dist/maven/maven-3/3.6.0/binaries/apache-maven-3.6.0-bin.tar.gz
sudo tar -xvzf apache-maven-3.6.0-bin.tar.gz
sudo mv apache-maven-3.6.0 maven 
```

Set environment variables by adding the following lines in the `/etc/profile.d/mavenenv.sh` file:

```
export JAVA_HOME=/usr/lib/jvm/default-java
export M2_HOME=/opt/maven
export PATH=${M2_HOME}/bin:${PATH}
```

Give the execution rights on the environment variable file:

```
sudo chmod +x /etc/profile.d/mavenenv.sh
```

Load the env file:

```
source /etc/profile.d/mavenenv.sh
```

Add this command at the end of your `~/.zshrc` file:
```
source /etc/profile.d/mavenenv.sh
```

Verify it works with:
```
mvn --version
```

<br/>

## Install CLAVIN API


Clone the CLAVIN REST API repo:
```
git clone https://github.com/Berico-Technologies/CLAVIN-rest
cd CLAVIN-rest 
```

Edit the `pom.xml` file and add the following lines inside the `<properties>` tag.

<pre><code>&lt;maven.compiler.source&gt;1.6&lt;/maven.compiler.source&gt;
 &lt;maven.compiler.target&gt;1.6&lt;/maven.compiler.target&gt;
</code></pre>

Build the jar executable:

```
mvn clean install

or $ mvn package
```

Download Geonames:
```
curl -O http://download.geonames.org/export/dump/allCountries.zip
unzip allCountries.zip
```

Download CLAVIN yaml configuration file:
```
curl -O https://raw.githubusercontent.com/Berico-Technologies/CLAVIN-rest/master/clavin-rest.yml
```

Create a CLAVIN dictionary or index of geographical names (also called gazetteer):
```
java -Xmx4096m -jar ./target/clavin-rest-0.3.0-SNAPSHOT.jar index clavin-rest.yml
```

Run the REST server:
```
java -Xmx2048m -jar clavin-rest.jar server clavin-rest.yml 
```

The API will be available at: http://localhost:9090/api/v0/geotag

