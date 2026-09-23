# LoRA au-delà de la démo : retour d'expérience sur la classification de 77 intentions

- Canonical URL: https://leandeep.com/lora-au-del%C3%A0-de-la-d%C3%A9mo-retour-dexp%C3%A9rience-sur-la-classification-de-77-intentions/
- Author: Olivier Eeckhoutte
- Published: 2024-12-18T08:30:00+01:00
- Updated: 2024-12-18T08:30:00+01:00
- Language: fr
- Tags: Generative AI, LLM, LoRA, Fine-tuning, MLOps, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Sur un cas de classification de demandes clients couvrant **77 intentions bancaires**, le modèle de base routait correctement **50,06 %** des 3 080 demandes du test. Après un fine-tuning supervisé avec LoRA, réalisé sans modifier les poids d'origine du modèle, l'accuracy est montée à **92,01 %** : **+41,95 points**, soit environ **84 % d'erreurs en moins**. Dans le même temps, le taux de réponses respectant strictement le contrat JSON est passé de 96,62 % à 99,97 %.

Ce résultat est suffisamment fort pour justifier ce retour d'expérience, mais pas pour conclure qu'un LLM est toujours le meilleur classifieur. Une baseline TF-IDF avec régression logistique a atteint 90,19 %. Le principal enseignement est ailleurs : un petit modèle correctement adapté, évalué et industrialisé peut apprendre une frontière de décision métier très fine. Le fine-tuning n'est cependant qu'une étape d'une chaîne qui commence par les données et se termine par l'observabilité en production.

## Le problème : router une demande vers la bonne intention

Le cas d'usage ressemble à ce que l'on rencontre dans de nombreux centres de contact. Une phrase libre doit être associée à une intention d'une taxonomie fermée :

- carte non reçue ;
- paiement par carte refusé ;
- virement en attente ;
- retrait non reconnu ;
- taux de change incorrect ;
- carte virtuelle indisponible ;
- vérification d'identité impossible.

La difficulté ne vient pas seulement du nombre de classes. Plusieurs intentions sont sémantiquement très proches. « Mon virement n'est toujours pas arrivé » peut décrire un virement encore en cours, un virement échoué ou un virement que le bénéficiaire n'a pas reçu. La décision dépend souvent d'un indice lexical minuscule et de la définition métier exacte de chaque label.

J'ai utilisé **BANKING77**, un dataset public publié en 2020 par PolyAI. Il contient 13 083 requêtes annotées et 77 intentions. Ce choix rend l'expérience reproductible, mais il pose une limite importante : un dataset public a pu être vu pendant le pré-entraînement d'un modèle. Je considère donc ce benchmark comme une validation de la chaîne technique, pas comme une preuve suffisante pour déployer le modèle sur du trafic bancaire réel.

## Pourquoi LoRA, et pourquoi le fine-tuning ?

Avant d'entraîner quoi que ce soit, j'utilise une règle simple :

| Besoin principal | Technique à tester en premier |
|---|---|
| Ajouter des connaissances qui changent souvent | RAG |
| Obtenir rapidement un comportement avec quelques exemples | Prompting / few-shot |
| Apprendre un style, un format ou une frontière de décision stable | Fine-tuning supervisé |
| Optimiser une préférence entre plusieurs bonnes réponses | Entraînement par préférences |

Ici, la taxonomie est stable et la sortie attendue est courte. Le problème consiste à apprendre une décision, pas à retrouver un document. Ajouter un RAG aurait augmenté la latence et la complexité sans traiter directement cette frontière de décision.

Un fine-tuning complet aurait été techniquement possible sur un petit modèle, mais peu intéressant pour ce cas :

- il faut optimiser et sauvegarder tous les poids ;
- chaque variante métier produit une copie complète du modèle ;
- le coût mémoire de l'optimiseur augmente fortement ;
- le rollback et la gestion de plusieurs versions deviennent plus lourds.

LoRA, pour **Low-Rank Adaptation**, gèle la matrice de poids d'origine `W` et apprend une mise à jour de faible rang :

~~~text
W' = W + (alpha / r) × B × A
~~~

Si `W` est une grande matrice, `A` et `B` sont beaucoup plus petites. Le rang `r` limite la capacité de cette mise à jour. Pendant l'entraînement, seuls les paramètres LoRA reçoivent des gradients ; le modèle de base reste immuable.

Dans mon run, l'adaptateur représentait environ **34,9 millions de paramètres entraînables** sur 1,72 milliard de paramètres uniques, soit **2,03 %**. Ce ratio réduit fortement le coût d'optimisation et permet de conserver un modèle de base commun à plusieurs adaptateurs.

Il faut toutefois éviter un raccourci fréquent : entraîner 2 % des paramètres ne signifie pas consommer 2 % de la mémoire d'un fine-tuning complet. Les activations du forward pass restent nécessaires. LoRA réduit surtout les gradients, les états de l'optimiseur et le volume des checkpoints.

## LoRA et QLoRA répondent à deux contraintes différentes

J'ai choisi un entraînement LoRA en **BF16** parce que le modèle tenait confortablement en mémoire. Quand ce n'est plus le cas, QLoRA ajoute une quantification du modèle de base gelé, généralement en 4 bits NF4, puis rétropropage les gradients vers les adaptateurs LoRA.

La distinction est importante :

- **LoRA** : le modèle de base reste typiquement en FP16 ou BF16 ;
- **QLoRA** : le modèle de base gelé est quantifié afin de réduire davantage la mémoire ;
- dans les deux cas, les adaptateurs restent entraînables dans une précision adaptée au calcul.

QLoRA est un excellent outil pour rendre un entraînement possible sur un GPU plus petit. Je ne le choisis pas automatiquement : la quantification ajoute un chemin numérique et opérationnel à valider. Si le modèle tient en BF16 avec une marge correcte, je préfère commencer par le chemin le plus simple, puis mesurer QLoRA comme une expérience séparée.

## La qualité du dataset a davantage compté que le choix du rang

Le split officiel de BANKING77 contient 10 003 exemples de train et 3 080 exemples de test, soit 40 demandes par intention dans le test. J'ai créé une validation à partir du train, puis audité les partitions avant de lancer le GPU.

Après normalisation et contrôle :

| Partition | Nombre d'exemples | Usage |
|---|---:|---|
| Train | 8 454 | Calcul des gradients |
| Validation | 1 492 | Choix du checkpoint et des hyperparamètres |
| Test officiel | 3 080 | Mesure finale, une fois les choix figés |

Deux exemples du train portant le même texte avec des labels incompatibles ont été mis en quarantaine. J'ai aussi retiré du train 25 chevauchements avec le test et 30 doublons internes. Le test officiel est resté intact, y compris ses propres doublons, afin de ne pas fabriquer un benchmark plus favorable.

J'ai appliqué deux niveaux de détection :

1. comparaison exacte après normalisation de la casse, des espaces et de la ponctuation ;
2. recherche de quasi-doublons par similarité lexicale.

Le second audit a signalé des formulations très proches entre train et test. Je ne les ai pas supprimées automatiquement : une forte similarité ne prouve pas une fuite, et modifier le test officiel aurait rendu la comparaison moins lisible. En revanche, j'ai conservé ce résultat dans les artefacts du run.

Cette étape est moins spectaculaire que le choix de `r` ou du learning rate, mais elle protège l'expérience contre l'erreur la plus coûteuse : attribuer au modèle un gain qui vient en réalité d'une fuite de données.

## Le contrat de sortie fait partie du modèle

Le modèle reçoit la demande, la liste contrôlée des intentions et l'instruction de répondre avec un seul objet JSON :

~~~json
{"intent": "card_arrival"}
~~~

La cible d'entraînement contient uniquement la réponse de l'assistant. Les tokens du prompt sont masqués dans la loss. Autrement dit, le modèle apprend à produire le label attendu ; il n'est pas récompensé pour recopier l'instruction ou la taxonomie.

J'ai conservé exactement le même prompt, le même tokenizer et le même décodage pour le modèle de base et le modèle adapté :

- température à 0 ;
- 64 nouveaux tokens au maximum ;
- aucune réparation automatique du JSON ;
- toute sortie invalide compte comme une erreur.

Réparer silencieusement une sortie rend une démonstration plus flatteuse, mais mélange la qualité du modèle avec celle d'un post-traitement. En production, un parseur défensif reste utile. Dans une évaluation comparative, je veux savoir quel composant a produit le gain.

## Configuration du fine-tuning

Le modèle de base de cette expérience est un causal LM open-weight compact de 1,7 milliard de paramètres, chargé en BF16. Je le désigne ici par `base-1.7B` afin de garder ce retour centré sur le protocole plutôt que d'en faire un classement de fournisseurs. Dans le registre interne, l'identifiant du modèle, sa révision, les hashes du tokenizer et les poids sont bien sûr figés.

La configuration principale était la suivante :

~~~yaml
precision: bf16
max_sequence_length: 1024
seed: 42

lora:
  rank: 32
  alpha: 64
  dropout: 0.0
  target_modules:
    - q_proj
    - k_proj
    - v_proj
    - o_proj
    - gate_proj
    - up_proj
    - down_proj

training:
  optimizer: adamw
  learning_rate: 0.0001
  scheduler: cosine
  warmup_steps: 40
  micro_batch_size: 2
  gradient_accumulation_steps: 4
  effective_batch_size: 8
  max_updates: 1200
  evaluate_every: 200
  save_every: 200
~~~

Avec PEFT, le cœur de la configuration ressemble à ceci :

~~~python
from peft import LoraConfig, TaskType, get_peft_model

lora_config = LoraConfig(
    r=32,
    lora_alpha=64,
    lora_dropout=0.0,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
    target_modules=[
        "q_proj",
        "k_proj",
        "v_proj",
        "o_proj",
        "gate_proj",
        "up_proj",
        "down_proj",
    ],
)

model = get_peft_model(base_model, lora_config)
model.print_trainable_parameters()
~~~

Le choix du rang 32 n'est pas une best practice universelle. Avec 77 classes proches et un modèle compact, je voulais donner suffisamment de capacité à l'adaptateur. Sur une taxonomie de dix intentions bien séparées, un rang 8 ou 16 pourrait suffire. La bonne démarche consiste à tester quelques valeurs sous un budget fixe et à sélectionner sur la validation.

J'ai ciblé les projections d'attention et les couches linéaires du MLP. Cibler seulement `q_proj` et `v_proj` réduit encore le nombre de paramètres, mais peut limiter l'adaptation sur une tâche qui demande une séparation sémantique fine. Ce choix doit lui aussi être évalué, pas adopté par habitude.

Le **batch effectif de 8** vient de deux exemples traités simultanément et de quatre accumulations de gradients :

~~~text
batch effectif = micro-batch 2 × accumulation 4 = 8 exemples
~~~

Une mise à jour de l'optimiseur intervient donc après huit exemples. À 1 200 mises à jour, le modèle a vu environ 9 600 exemples, soit 1,14 passage sur les 8 454 exemples de train. Compter les mises à jour sans les relier au batch effectif et à la taille du dataset ne permet pas de comparer deux entraînements.

## La validation choisit le checkpoint, le test ne choisit rien

Pour limiter le coût de génération pendant l'entraînement, j'ai utilisé un sous-ensemble de validation équilibré : quatre exemples par classe, soit 308 demandes identiques pour chaque checkpoint.

| Mise à jour | Accuracy validation | Macro-F1 validation |
|---:|---:|---:|
| 200 | 77,60 % | 76,62 % |
| 400 | 85,39 % | 84,95 % |
| 600 | 88,96 % | 88,49 % |
| 800 | 90,91 % | 90,68 % |
| 1 000 | 91,56 % | 91,56 % |
| 1 200 | **92,86 %** | **92,80 %** |

Le checkpoint 1 200 a été retenu avant d'ouvrir les résultats du test. La courbe progressait encore ; 1 200 était donc une limite de budget expérimental, pas la preuve d'un optimum mathématique. La suite logique aurait été de prolonger un run contrôlé, puis de sélectionner à nouveau sur validation.

La **train loss seule ne répond pas** à la question « quel checkpoint dois-je déployer ? ». Elle mesure la capacité à prédire les tokens cibles sur les exemples d'entraînement. Elle peut continuer à baisser alors que :

- la généralisation plafonne ;
- le modèle mémorise certaines formulations ;
- la conformité JSON se dégrade ;
- des classes rares régressent ;
- la calibration devient moins bonne.

Je sélectionne donc sur une métrique métier calculée par génération complète. Une accuracy token en teacher forcing n'est pas une accuracy d'intention : prédire correctement les accolades et les guillemets ne signifie pas avoir choisi le bon label.

## Résultats sur le test gelé

Les trois méthodes ont été évaluées sur les mêmes 3 080 demandes du test officiel :

| Méthode | Accuracy | Macro-F1 | JSON valide |
|---|---:|---:|---:|
| `base-1.7B`, sans adaptation | 50,06 % | 49,06 % | 96,62 % |
| `base-1.7B` + LoRA | **92,01 %** | **92,01 %** | **99,97 %** |
| TF-IDF + régression logistique | 90,19 % | 90,19 % | 100 % |

Le gain apparié du LoRA est de **41,95 points d'accuracy**. Sur les 3 080 demandes :

- 1 320 erreurs du modèle de base ont été corrigées ;
- 28 réponses auparavant correctes ont régressé ;
- 1 732 réponses sont restées inchangées ;
- 246 erreurs subsistent après fine-tuning.

Un bootstrap apparié de 5 000 tirages donne un intervalle à 95 % de **[+40,13 ; +43,80] points** pour le gain d'accuracy. Cet intervalle rééchantillonne des requêtes, pas des clients, et ne couvre ni l'incertitude d'annotation ni une éventuelle contamination du pré-entraînement.

L'accuracy et le macro-F1 sont presque identiques parce que le test contient exactement 40 exemples par classe. En production, la distribution sera rarement équilibrée. Je suivrais donc également le rappel par classe, le coût métier de chaque confusion et une matrice de confusion pondérée par les vrais volumes.

## Ce que le modèle a réellement appris

L'amélioration la plus intéressante ne vient pas des intentions évidentes, mais des frontières fines de la taxonomie. Avant adaptation, le modèle avait tendance à choisir un label général :

- une erreur de conversion lors d'un achat devenait simplement `exchange_rate` ;
- un retrait toujours en attente devenait `cash_withdrawal_not_recognised` ;
- une carte absente de l'application devenait un problème de solde ;
- une demande sur les devises disponibles devenait une question sur le taux de change.

Après LoRA, le modèle distingue beaucoup mieux l'objet, le canal et l'état de l'opération. Il apprend la convention de labellisation spécifique au métier, alors que le modèle de base se contente d'une similarité sémantique générale.

Les 28 régressions sont tout aussi instructives. Certaines formulations restent réellement ambiguës : « mon transfert prend beaucoup de temps » peut relever de `pending_transfer`, `transfer_timing` ou `transfer_not_received_by_recipient` selon le contexte absent. À ce stade, augmenter le rang ou le nombre de steps ne résout pas nécessairement le problème. Les options d'architecture deviennent :

- demander une clarification ;
- retourner un top-k avec scores ;
- définir une classe de rejet ;
- appliquer une règle métier sur les cas à fort risque ;
- envoyer les cas incertains à un opérateur.

Un modèle qui répond toujours par l'une des 77 classes peut afficher une bonne accuracy tout en étant dangereux sur les demandes hors taxonomie. Le test suivant doit donc porter sur l'**out-of-scope detection**, absente de BANKING77.

## Pourquoi la baseline classique reste essentielle

La régression logistique sur des features TF-IDF de caractères atteint 90,19 %. Le LoRA la dépasse de 1,82 point dans ce run, sans que j'aie calculé un intervalle apparié entre les deux méthodes. Je parle donc d'un score observé, pas d'une supériorité statistiquement démontrée.

Pour un routeur pur, à très fort volume et avec une taxonomie stable, la baseline classique possède de sérieux avantages :

- latence faible et prévisible ;
- coût d'inférence minime ;
- comportement déterministe ;
- déploiement et explicabilité plus simples.

Le LoRA devient plus intéressant si le même modèle doit ensuite extraire des attributs, comprendre plusieurs langues, gérer des formulations longues ou alimenter une chaîne générative. Le choix d'architecture doit intégrer l'ensemble du produit, pas seulement le meilleur score d'une colonne.

Ce point a changé ma manière de cadrer les projets GenAI : je demande systématiquement une baseline non-LLM. Sans elle, on sait que le fine-tuning améliore un LLM, mais pas que le LLM est nécessaire.

## Reproductibilité : un adaptateur seul ne suffit pas

Un fichier d'adaptateur n'est pas un modèle autonome. Son identité dépend de plusieurs artefacts :

~~~text
modèle déployé
  = base model à une révision précise
  + tokenizer et chat template
  + adaptateur LoRA
  + prompt versionné
  + paramètres de décodage
  + code de parsing
~~~

Pour chaque run, j'enregistre dans MLflow :

- le commit Git et le lock des dépendances ;
- l'identifiant et la révision immuable du modèle de base ;
- le hash du dataset et les identifiants des partitions ;
- la seed ;
- la configuration LoRA ;
- le batch réellement utilisé ;
- les métriques train et validation par step ;
- les checkpoints ;
- les résultats de génération ;
- les matrices de confusion et les erreurs appariées ;
- les hashes SHA-256 des artefacts retenus.

Je conserve aussi les échecs. Un run interrompu pour manque de mémoire ou une configuration qui produit du JSON invalide fait partie de l'historique expérimental. Supprimer ces traces crée une vision artificiellement linéaire de la recherche.

## Le chemin jusqu'à la production

Je ne déploierais pas directement l'adaptateur qui vient de gagner le benchmark. Le passage en production suit plusieurs portes :

1. **Gate de données** : provenance, licence, PII, conflits de labels, doublons et séparation des partitions.
2. **Gate offline** : macro-F1, rappel par intention, validité du contrat, latence, mémoire et robustesse sur paraphrases.
3. **Gate métier** : revue des confusions coûteuses et accord sur la politique de rejet.
4. **Shadow traffic** : le modèle observe du trafic réel sans piloter le routage.
5. **Canary** : exposition progressive à une petite part du trafic avec rollback immédiat.
6. **Monitoring** : dérive des entrées, distribution des intentions, taux de rejet, invalides JSON, latence et corrections humaines.

La prod doit pouvoir revenir au modèle précédent en changeant une référence d'artefact. Je garde la base et l'adaptateur séparés tant que j'ai besoin de charger plusieurs adaptations ou de revenir rapidement en arrière. Je ne fusionne les poids que si la simplification du serving ou la mesure de latence le justifie.

Le monitoring de la loss n'a plus de sens une fois le modèle en service. Il faut observer des proxys disponibles immédiatement, puis rattacher les labels métier lorsqu'ils arrivent. Une hausse soudaine de `card_payment_not_recognised` peut signaler un incident produit, une fraude, un changement de vocabulaire ou une dérive du modèle. L'alerte doit déclencher une analyse, pas un réentraînement automatique.

## Ce que je ferais ensuite

Le run valide la pertinence de LoRA sur une taxonomie fine. Il laisse plusieurs travaux ouverts :

- construire un test privé, récent et temporellement postérieur au train ;
- ajouter des exemples hors périmètre et mesurer le taux de faux routage ;
- évaluer la calibration et définir un seuil d'abstention ;
- comparer les rangs 8, 16 et 32 sous le même budget ;
- mesurer un LoRA attention-only face à attention + MLP ;
- tester QLoRA NF4 séparément, avec les mêmes seeds et partitions ;
- mesurer la latence et le débit dans le serveur d'inférence réel ;
- répéter l'expérience sur plusieurs seeds ;
- faire annoter les cas ambigus par plusieurs experts métier.

Je travaillerais aussi sur la taxonomie. Lorsque deux labels ne peuvent pas être distingués de façon fiable à partir du texte disponible, le problème ne vient pas toujours du modèle. Il peut venir d'une définition métier trop subtile ou d'un manque de contexte dans l'interface.

## Mon retour d'architecte

LoRA rend le fine-tuning accessible, mais la facilité de lancer un entraînement ne doit pas masquer la difficulté de prouver qu'il améliore le système.

Le gain de 50,06 % à 92,01 % est réel dans ce protocole. Ce qui le rend exploitable n'est pourtant pas le chiffre seul. C'est le fait d'avoir gelé le test, compté les sorties invalides comme des erreurs, comparé les prédictions une à une, conservé une baseline classique, sélectionné le checkpoint sur validation et versionné l'ensemble du contrat d'inférence.

La décision d'architecture reste conditionnelle :

- si le besoin est une classification pure à coût minimal, la baseline classique peut gagner ;
- si le produit a besoin de compréhension sémantique plus large et de sorties structurées, un petit LLM avec LoRA devient une option solide ;
- si la connaissance change fréquemment, il faut probablement compléter avec du retrieval ;
- si le coût d'une erreur est élevé, l'abstention et la revue humaine font partie du modèle de service.

LoRA ne transforme pas un benchmark en produit. Il offre une manière efficace d'adapter le comportement d'un modèle. La valeur vient de la discipline appliquée autour : données, évaluation, traçabilité, serving et boucle de retour métier.

## Références

- Edward J. Hu et al., [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685), 2021.
- Tim Dettmers et al., [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314), 2023.
- Iñigo Casanueva et al., [Efficient Intent Detection with Dual Sentence Encoders](https://aclanthology.org/2020.nlp4convai-1.5/), ACL 2020.
- PolyAI, [BANKING77 dans le dépôt Task-Specific Datasets](https://github.com/PolyAI-LDN/task-specific-datasets), 2020.
- Hugging Face, [PEFT](https://github.com/huggingface/peft), bibliothèque d'adaptation efficace en paramètres.
- MLflow 2.17, [MLflow Tracking](https://mlflow.org/docs/2.17.0/tracking.html), suivi des paramètres, métriques et artefacts d'expérimentation.

