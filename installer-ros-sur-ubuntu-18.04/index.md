# Installer ROS sur Ubuntu 18.04

- Canonical URL: https://leandeep.com/installer-ros-sur-ubuntu-18.04/
- Author: Olivier Eeckhoutte
- Published: 2020-03-29T16:01:00+02:00
- Updated: 2020-03-29T16:01:00+02:00
- Language: fr
- Tags: ROS, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article nous allons voir comment installer ROS sur Ubuntu 18.04 et créer son workspace de travail.

<br/>

## Installation sur Ubuntu directement (sans Docker)

**Installation de ROS Melodic**

```
# Ajouter le repo ROS
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'

# Truster le repo ROS
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654

sudo apt install ros-melodic-desktop-full
```

<br/>

**Installation de rosdep**

```
sudo apt install python-rosdep python-rosinstall python-rosinstall-generator python-wstool build-essential
sudo rosdep init
rosdep update
```

<br/>

**Ajout des variables d'environnement au terminal**

Rendez-vous dans le répertoire `/opt/ros/melodic/` et recherchez les fichiers setup.QUELQUE_CHOSE. Repérez celui qui correspond à votre shell et executez la commande correspondante:

```
echo "source /opt/ros/melodic/setup.zsh" >> ~/.zshrc

# Alternative: 
# echo "source /opt/ros/melodic/setup.bash" >> ~/.bashrc
```

<br/>

**Installation de rosinstall**

Pour gérer les *source trees* de certains paquets particulier ROS:
```
sudo apt install python-rosinstall
```

<br/>

## Vérification du bon fonctionnement

Dans un terminal exécuter la commande suivante:

```
roscore
```

Dans un second terminal exécuter la commande suivante:

```
rosrun turtlesim turtlesim_node
```

Si une tortue apparaît dans une nouvelle fenêtre, c'est que l'installation est correcte. 

> Même à distance via SSH, vous devriez voir apparaître cette fenêtre. Si vous avez une erreur du genre `Could not connect to any X display`, ajoutez le flag `-X` lors de votre connexion `SSH`.

<br/>

## Installation avec Docker

Docker est une option intéressante. Je l'ai testé et cela fonctionne très bien.
Je préfère néanmoins l'installation directement sur le système pour éviter de me prendre la tête avec le serveur X. 

<br/>

```
git clone https://github.com/jbnunn/ROSGazeboDesktop
cd ROSGazeboDesktop
# Le Dockerfile contient une erreur. Il faut ajouter l'installation du paquet python-rosdep

docker build -t ros-gazebo-desktop .
mkdir data
docker run -it --rm --name=ros_gazebo_desktop -m=4g -p 6080:80 -p 5900:5900 -v $PWD/data:/home/ubuntu/data -e RESOLUTION=1680x860 -e USER=ubuntu -e PASSWORD=ubuntu ros-gazebo-desktop   
```

<br/>

On peut ensuite se connecter au container via VNC: http://locahost:6080/

<br/>

Démarrer un nouveau monde:
```
roslaunch gazebo_ros empty_world.launch 
```

<br/>

Importer un modèle:
```
rosrun gazebo_ros spawn_model -file ~/.gazebo/models/create/model-1_4.sdf -sdf -model Create
```

<br/>

D'autres mondes sont disponibles:

```
roslaunch gazebo_ros willowgarage_world.launch
roslaunch gazebo_ros mud_world.launch
roslaunch gazebo_ros shapes_world.launch
roslaunch gazebo_ros rubble_world.launch
```

<br/>

Commandes disponibles pour faire bouger le robot:
```
rostopic list

/clock
/gazebo/link_states
/gazebo/model_states
/gazebo/parameter_descriptions
/gazebo/parameter_updates
/gazebo/set_link_state
/gazebo/set_model_state
/rosout
```

<br/>

Faire bouger le robot:
```
rostopic pub /gazebo/set_model_state gazebo_msgs/ModelState '{model_name: Create, pose: { position: { x: 0, y: 0, z: 0 }, orientation: {x: 0, y: 0, z: 0} }, twist: { linear: { x: 1, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0}  }, reference_frame: world }'
```

<br/>

D'autres modèles sont disponibles à [l'adresse suivante](https://bitbucket.org/osrf/gazebo_models).

<br/>

## Création du workspace

```
mkdir -p ~/catkin_ws/src
cd catkin_ws/src
catkin_init_workspace
cd ~/catkin_ws
catkin_make
```

<br/>

Pour accéder au workspace nouvellement créé:
```
echo "source ~/catkin_ws/devel/setup.zsh" >> ~/.zshrc
source ~/.zshrc
```

<br/>

Si la commande suivante retourne un path, c'est tout est ok.
```
echo $ROS_PACKAGE_PATH
```
