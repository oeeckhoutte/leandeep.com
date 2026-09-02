# Fine-tune Yolo pour détecter un feu

- Canonical URL: https://leandeep.com/fine-tune-yolo-pour-d%C3%A9tecter-un-feu/
- Author: Olivier Eeckhoutte
- Published: 2025-07-19T11:36:00+02:00
- Updated: 2025-07-19T11:36:00+02:00
- Language: fr
- Tags: Machine Learning, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



On crée un jupyter notebook:

```
mkdir yolo-finetune-fire && cd $_
touch yolo-finetune.ipynb
```

<br/>

**Contenu du Notebook**

```
MY_SECRET_KEY="..."
```

```
!pip install ultralytics
!pip install roboflow
```


```
import os
import yaml
import ultralytics
import pandas as pd
from roboflow import Roboflow
from ultralytics import YOLO
from IPython.display import Image, display
```

<br/>

**Contenu Markdown**

yolov11s.pt vs yolov11n.pt

Le "s" signifie "small" (petit). Modèle plus grand que "n", avec plus de couches et de paramètres. Meilleure précision, mais plus lent et plus gourmand en ressources que "n". yolov11n.pt

Le "n" signifie "nano" (très petit). Modèle très léger, moins de couches et de paramètres. Plus rapide et moins gourmand en ressources, mais précision généralement plus faible.

<br/>

```
!wget -nc https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11s.pt
```

```
rf = Roboflow(api_key=MY_SECRET_KEY)
#model_version = "yolov8"
model_version = "yolov11"
epoch_count = "2"
os.environ["EPOCH_COUNT"] = epoch_count
run_dir_name = f"runs_{model_version}"
os.environ["MODEL_VERSION"] = model_version
os.environ["RUN_DIR_NAME"] = run_dir_name
base_path = f"/home/olivier/Dev/fire/machine_learning/yolo-finetune-fire"
os.environ["BASE_PATH"] = base_path
project = rf.workspace("-jwzpw").project("continuous_fire")
print(f"Downloading model {model_version} in path {base_path}")
dataset = project.version(6).download(model_version, location=base_path)
```

```
if model_version == "yolov8":
    os.environ["BASE_MODEL_FILENAME"] = f"{model_version}s.pt"
elif model_version == "yolov11":
    os.environ["BASE_MODEL_FILENAME"] = f"yolo11s.pt"
```

```
!yolo task=detect mode=train model=$BASE_MODEL_FILENAME data=$BASE_PATH/continuous_fire-6/data.yaml epochs=$EPOCH_COUNT imgsz=640 plots=True project=$BASE_PATH/$RUN_DIR_NAME/detect
```

```
runs_path = os.path.join(base_path, f"{run_dir_name}/detect")

train_dirs = [d for d in os.listdir(runs_path) if d.startswith("train")]

train_dirs_sorted = sorted(train_dirs, key=lambda x: int(x.replace("train", "") or "1"))

last_train_dir = train_dirs_sorted[-1]
os.environ["LAST_TRAIN_DIR"] = last_train_dir
```

```
Image(filename=f"{base_path}/{run_dir_name}/detect/{last_train_dir}/results.png", width=600)
```

<br/>

**Contenu Markdown**

Le fichier results.csv contient les métriques d’entraînement et de validation pour chaque epoch. Voici comment interpréter les principales colonnes:

epoch: numéro de l’époque (itération complète sur le dataset).

time: temps écoulé pour chaque epoch.

train/box_loss, train/cls_loss, train/dfl_loss: pertes (loss) sur l’entraînement pour la localisation des boîtes, la classification et la distribution des frontières (Dfl).

val/box_loss, val/cls_loss, val/dfl_loss : mêmes pertes mais sur le jeu de validation.
metrics/precision(B) : précision sur la validation (proportion de vraies détections parmi toutes les détections).

metrics/recall(B) : rappel sur la validation (proportion de vraies détections parmi tous les objets à détecter).

metrics/mAP50(B) : moyenne des précisions pour un IoU de 0.5 (métrique clé pour la détection d’objets).

metrics/mAP50-95(B) : mAP moyenne pour des IoU de 0.5 à 0.95 (plus stricte, plus représentative).

lr/pg0, lr/pg1, lr/pg2 : taux d’apprentissage pour différents groupes de paramètres.

À retenir :

Plus les valeurs de metrics/mAP50(B) et metrics/mAP50-95(B) sont élevées, meilleur est le modèle.

Les pertes (loss) doivent généralement diminuer au fil des epochs.

Surveille la différence entre les pertes d’entraînement et de validation pour détecter un éventuel surapprentissage (overfitting).

Pour choisir le meilleur modèle, regarde l’epoch où metrics/mAP50(B) est maximal : c’est à cette epoch que le fichier best.pt est sauvegardé.

<br/>

```
!yolo task=detect mode=val model=$BASE_PATH/$RUN_DIR_NAME/detect/$LAST_TRAIN_DIR/weights/best.pt data=$BASE_PATH/continuous_fire-6/data.yaml project=$BASE_PATH/$RUN_DIR_NAME/detect/$LAST_TRAIN_DIR
```

```
results_csv = os.path.join(runs_path, last_train_dir, "results.csv")
if os.path.exists(results_csv):
    df = pd.read_csv(results_csv)
    # On considère que la meilleure performance correspond au meilleur mAP50 sur la validation
    best_idx = df["metrics/mAP50(B)"].idxmax()
    best_epoch = int(df.loc[best_idx, "epoch"])
    best_map = df.loc[best_idx, "metrics/mAP50(B)"]
    #print(f"Le modèle est le plus performant à l'epoch {best_epoch} avec un mAP50(B) de {best_map:.3f}.")
    total_epochs = len(df)
    print(f"Le modèle est le plus performant à l'epoch {best_epoch} / {total_epochs} avec un mAP50(B) de {best_map:.3f}.")
    print("C'est à cette epoch que le fichier best.pt a été sauvegardé, car il correspond à la meilleure performance sur le jeu de validation (mAP50).")
    table = df[["epoch", "metrics/mAP50(B)"]]
    print(table.to_string(index=False))
else:
    print("Le fichier results.csv n'existe pas dans le dernier dossier train.")
```


```
val_images_dir = os.path.join(base_path, f"{run_dir_name}/detect", last_train_dir, "val")

if os.path.exists(val_images_dir):
    images = [f for f in os.listdir(val_images_dir) if f.lower().endswith(('.jpg', '.png'))]
    if images:
        for img_name in images:
            img_path = os.path.join(val_images_dir, img_name)
            display(Image(filename=img_path, width=600))
    else:
        print("Aucune image trouvée dans le dossier de validation.")
else:
    print("Le dossier de validation n'existe pas.")
```


> Personal note: notebook location on AI Server: `/home/olivier/Dev/fire/machine_learning`

> `jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root` <- commande à utiliser uniquement en développement (sans donnée de prod)

