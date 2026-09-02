# Workaround "Object Capture is not available on this computer" Photogrammetry

- Canonical URL: https://leandeep.com/workaround-object-capture-is-not-available-on-this-computer-photogrammetry/
- Author: Olivier Eeckhoutte
- Published: 2021-12-24T06:34:00Z
- Updated: 2021-12-24T06:34:00Z
- Language: fr
- Tags: Development, 3D, Photogrammetry, Metaverse
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


### Introduction

J'ai voulu expérimenter la nouvelle API disponible sur OSX Monterey appelée Object Capture qui permet de faire de la Photogrammetry. Mon objectif était de scanner des humains afin de créer leur avatar en 3D.
Apple semble avoir un formidable nouvel outil pour faire de la photogrammetry et après avoir tout téléchargé, installé et analysé côté documentation je me suis pris cette erreur `Object Capture is not available on this computer` lorsque j'ai voulu RUN mon premier projet...

Le problème vient des specifications techniques de mon Mac. Il manque 2 Go de VRAM. Il n'en a que 2 au lieu de 4 requis. La pilule est quand même dur à avaler il fonctionne très bien malgré tout ce que je lui fait endurer. Côté RAM et processeur pas de problème mais côté carte graphique cela pose problème. J'ai un eGPU Razer avec une carte graphique très récente dont je me sers pour le Deep Learning. Apparemment quelqu'un aurait réussi à utiliser son eGPU avec cette API dans [cet article](https://developer.apple.com/forums/thread/681861?answerId=677919022). Je ferais le test à l'occasion mais ce n'est plus une nécessité...

En attendant, j'ai un magnifique **workaround**. Utiliser Meshroom et créer un mix de Python et de commandes Linux. Le résultat est au top:

![image](/images/scan-3d.png)

> En pré-requis, il vous faudra:
> - un GPU 
> - Jupyter Lab ou [Colab](colab.research.google.com). (Dans mon cas, c'est Colab)

<br/>

### Code

On démarrer une instance avec GPU

```
import tensorflow as tf
device_name = tf.test.gpu_device_name()
if device_name != '/device:GPU:0':
  raise SystemError('GPU device required')
print(f'GPU found at: {device_name}')
```

<br/>

Chargement des données via une des 3 options

```
# Option 1
# From Google Drive and upload
from google.colab import drive, files
drive.mount('/content/drive')
uploaded = files.upload()
for file in uploaded.keys():
    print(f'File "{file}" uploaded with length {len(uploaded[file])} bytes')

# Option 2
# OR via WGET
!wget https://devimages-cdn.apple.com/ar/photogrammetry/FruitCakeSliceImages.zip
!unzip FruitCakeSliceImages.zip
!mkdir input_dataset
#!rm FruitCakeSliceImages.zip
#!mv FruitCakeSlice/*.HEIC input_dataset/
!ls -l ./input_dataset
# Optional rename extension
#cd FruitCakeSliceImages
#!find . -type f -name "*.HEIC" -exec rename 's/\.HEIC$/.jpg/' '{}' \;

# Option 3
# OR via Github
!git clone https://github.com/alicevision/dataset_buddha
!ls -l dataset_buddha/buddha
!rm -rf dataset_buddha/buddha/*.bin
!rm -rf dataset_buddha/buddha/*.txt
!rm -rf dataset_buddha/buddha/*.ini
!ls -l dataset_buddha/buddha
```

<br/>

On récupère Meshroom  
```
!wget -N https://github.com/alicevision/meshroom/releases/download/v2019.1.0/Meshroom-2019.1.0-linux.tar.gz
!mkdir meshroom
!tar xzf Meshroom-2019.1.0-linux.tar.gz -C ./meshroom
```

<br/>

On Mesh et on attend patiemment

```
!mkdir ./model_out
#!./meshroom/Meshroom-2019.1.0/meshroom_photogrammetry --input ./input_dataset --output ./model_out
!./meshroom/Meshroom-2019.1.0/meshroom_photogrammetry --input ./dataset_buddha/buddha --output ./model_out
```

<br/>

On zip et on récupère le résultat
```
!zip -r 3d_mesh_object.zip ./model_out
files.download('3d_mesh_object.zip')
```

<br/>

Et voilà, vous obtiendrez un zip contenant 3 fichiers que vous pourrez importer dans Blender ou autre
