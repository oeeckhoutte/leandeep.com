# LoRA au-delà de la démo : retour d'expérience sur la classification de 60 intentions d'assurance

- Canonical URL: https://leandeep.com/lora-au-del%C3%A0-de-la-d%C3%A9mo-retour-dexp%C3%A9rience-sur-la-classification-de-60-intentions-dassurance/
- Author: Olivier Eeckhoutte
- Published: 2024-12-18T08:30:00+01:00
- Updated: 2024-12-18T08:30:00+01:00
- Language: fr
- Tags: Generative AI, LLM, LoRA, Fine-tuning, MLOps, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Sur un cas de classification de demandes clients couvrant **60 intentions d'assurance**, le modèle de base routait correctement **50,07 %** des 3 000 demandes du test. Après un fine-tuning supervisé avec LoRA, réalisé sans modifier les poids d'origine du modèle, l'accuracy est montée à **92,00 %** : **+41,93 points**, soit environ **84 % d'erreurs en moins**. Dans le même temps, le taux de réponses respectant strictement le contrat JSON est passé de 96,63 % à 99,97 %.

Ce scénario est suffisamment représentatif pour tirer des enseignements d'architecture, mais il ne démontre pas qu'un LLM est toujours le meilleur classifieur. Une baseline TF-IDF avec régression logistique atteint 90,20 %. Un petit modèle correctement adapté, évalué et industrialisé peut apprendre une frontière de décision métier très fine. Le fine-tuning reste une étape d'une chaîne qui commence par les données et se termine par l'observabilité en production.

<br/>

## Le problème : router une demande d'assuré vers la bonne intention

Le cas d'usage ressemble à ce que l'on rencontre dans de nombreux centres de contact. Une phrase libre doit être associée à une intention d'une taxonomie fermée :

- déclarer un sinistre automobile
- suivre l'avancement d'une indemnisation
- contester un remboursement de santé
- signaler un prélèvement de cotisation inconnu
- obtenir une attestation d'assurance habitation
- modifier le bénéficiaire d'un contrat d'assurance-vie
- résilier un contrat à son échéance

La difficulté ne vient pas seulement du nombre de classes. Plusieurs intentions sont sémantiquement très proches. "Mon remboursement n'est toujours pas arrivé" peut concerner une indemnisation de sinistre, un remboursement de santé ou un dossier bloqué par une pièce manquante. La décision dépend souvent d'un indice lexical minuscule, du produit concerné et de la définition métier exacte de chaque label.

**ASSURANCE60** est le nom du cas d'étude utilisé dans cet article. Il modélise un corpus synthétique de 12 900 échanges de centre de contact répartis entre 60 intentions couvrant l'automobile, l'habitation, la santé, la prévoyance et l'assurance-vie. Les formulations sont conçues pour reproduire les ambiguïtés d'un trafic réel, mais elles ne proviennent pas de conversations clients. Les scores ci-dessous sont des valeurs éditoriales cohérentes destinées à expliquer le protocole ; ils ne doivent pas être cités comme des mesures obtenues sur les données de production d'un assureur.

<br/>

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

- il faut optimiser et sauvegarder tous les poids
- chaque variante métier produit une copie complète du modèle
- le coût mémoire de l'optimiseur augmente fortement
- le rollback et la gestion de plusieurs versions deviennent plus lourds

LoRA, pour **Low-Rank Adaptation**, gèle la matrice de poids d'origine `W` et apprend une mise à jour de faible rang :

~~~text
W' = W + (alpha / r) x B x A
~~~

Si `W` est une grande matrice, `A` et `B` sont beaucoup plus petites. Le rang `r` limite la capacité de cette mise à jour. Pendant l'entraînement, seuls les paramètres LoRA reçoivent des gradients ; le modèle de base reste immuable.

Dans la configuration retenue, l'adaptateur représente environ **34,9 millions de paramètres entraînables** sur 1,72 milliard de paramètres uniques, soit **2,03 %**. Ce ratio réduit fortement le coût d'optimisation et permet de conserver un modèle de base commun à plusieurs adaptateurs.

Il faut toutefois éviter un raccourci fréquent : entraîner 2 % des paramètres ne signifie pas consommer 2 % de la mémoire d'un fine-tuning complet. Les activations du forward pass restent nécessaires. LoRA réduit surtout les gradients, les états de l'optimiseur et le volume des checkpoints.

<br/>

## LoRA et QLoRA répondent à deux contraintes différentes

Le scénario retient un entraînement LoRA en **BF16**, puisque le modèle tient confortablement en mémoire. Quand ce n'est plus le cas, QLoRA ajoute une quantification du modèle de base gelé, généralement en 4 bits NF4, puis rétropropage les gradients vers les adaptateurs LoRA.

La distinction est importante :

- **LoRA** : le modèle de base reste typiquement en FP16 ou BF16
- **QLoRA** : le modèle de base gelé est quantifié afin de réduire davantage la mémoire
- dans les deux cas, les adaptateurs restent entraînables dans une précision adaptée au calcul

QLoRA est un excellent outil pour rendre un entraînement possible sur un GPU plus petit. Je ne le choisis pas automatiquement : la quantification ajoute un chemin numérique et opérationnel à valider. Si le modèle tient en BF16 avec une marge correcte, je préfère commencer par le chemin le plus simple, puis mesurer QLoRA comme une expérience séparée.

<br/>

## La qualité du dataset a davantage compté que le choix du rang

Le scénario ASSURANCE60 contient 8 400 exemples de train, 1 500 exemples de validation et 3 000 exemples de test, soit 50 demandes par intention dans le test. Les partitions sont figées avant le lancement de l'entraînement.

Après normalisation et contrôle :

| Partition | Nombre d'exemples | Usage |
|---|---:|---|
| Train | 8 400 | Calcul des gradients |
| Validation | 1 500 | Choix du checkpoint et des hyperparamètres |
| Test gelé | 3 000 | Mesure finale, une fois les choix figés |

Pendant la préparation, les textes identiques associés à des labels incompatibles sont mis en quarantaine, les doublons internes sont retirés du train et tout chevauchement avec le test est bloqué. Le test gelé reste ensuite inchangé afin de ne pas fabriquer un benchmark plus favorable.

J'ai appliqué deux niveaux de détection :

1. comparaison exacte après normalisation de la casse, des espaces et de la ponctuation ;
2. recherche de quasi-doublons par similarité lexicale.

Le second audit sert à repérer les formulations presque identiques entre partitions. Je ne supprime jamais automatiquement un exemple sur la seule base d'une forte similarité : un dossier d'indemnisation et un remboursement de santé peuvent partager le même vocabulaire tout en exigeant deux routages différents. Chaque cas signalé est revu et la décision est conservée dans les artefacts du run.

Cette étape est moins spectaculaire que le choix de `r` ou du learning rate, mais elle protège l'expérience contre l'erreur la plus coûteuse: attribuer au modèle un gain qui vient en réalité d'une fuite de données.

<br/>

## Le contrat de sortie fait partie du modèle

Le modèle reçoit la demande, la liste contrôlée des intentions et l'instruction de répondre avec un seul objet JSON :

~~~json
{"intent": "suivi_indemnisation"}
~~~

La cible d'entraînement contient uniquement la réponse de l'assistant. Les tokens du prompt sont masqués dans la loss. Autrement dit, le modèle apprend à produire le label attendu ; il n'est pas récompensé pour recopier l'instruction ou la taxonomie.

Le protocole conserve exactement le même prompt, le même tokenizer et le même décodage pour le modèle de base et le modèle adapté :

- température à 0
- 64 nouveaux tokens au maximum
- aucune réparation automatique du JSON
- toute sortie invalide compte comme une erreur

Réparer silencieusement une sortie rend une démonstration plus flatteuse, mais mélange la qualité du modèle avec celle d'un post-traitement. En production, un parseur défensif reste utile. Dans une évaluation comparative, je veux savoir quel composant a produit le gain.

<br/>

## Configuration du fine-tuning

Le modèle de base du scénario est un causal LM open-weight compact de 1,7 milliard de paramètres, chargé en BF16 et désigné par `base-1.7B`. Dans une implémentation réelle, son identifiant, sa révision, les hashes du tokenizer et les poids doivent être figés dans le registre d'expérimentation.

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

Avec PEFT, le coeur de la configuration ressemble à ceci :

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

Le choix du rang 32 n'est pas une best practice universelle. Avec 60 classes proches et un modèle compact, je voulais donner suffisamment de capacité à l'adaptateur. Sur une taxonomie de dix intentions bien séparées, un rang 8 ou 16 pourrait suffire. La bonne démarche consiste à tester quelques valeurs sous un budget fixe et à sélectionner sur la validation.

J'ai ciblé les projections d'attention et les couches linéaires du MLP. Cibler seulement `q_proj` et `v_proj` réduit encore le nombre de paramètres, mais peut limiter l'adaptation sur une tâche qui demande une séparation sémantique fine. Ce choix doit lui aussi être évalué, pas adopté par habitude.

Le **batch effectif de 8** vient de deux exemples traités simultanément et de quatre accumulations de gradients :

~~~text
batch effectif = micro-batch 2 x accumulation 4 = 8 exemples
~~~

Une mise à jour de l'optimiseur intervient donc après huit exemples. À 1 200 mises à jour, le modèle a vu environ 9 600 exemples, soit 1,14 passage sur les 8 400 exemples de train. Compter les mises à jour sans les relier au batch effectif et à la taille du dataset ne permet pas de comparer deux entraînements.

<br/>

## La validation choisit le checkpoint, le test ne choisit rien

Pour limiter le coût de génération pendant l'entraînement, le protocole utilise un sous-ensemble de validation équilibré : quatre exemples par classe, soit 240 demandes identiques pour chaque checkpoint.

| Mise à jour | Accuracy validation | Macro-F1 validation |
|---:|---:|---:|
| 200 | 77,92 % | 76,88 % |
| 400 | 85,42 % | 84,97 % |
| 600 | 89,17 % | 88,65 % |
| 800 | 90,83 % | 90,55 % |
| 1 000 | 91,67 % | 91,51 % |
| 1 200 | **92,92 %** | **92,74 %** |

Dans le scénario, le checkpoint 1 200 est retenu avant l'ouverture des résultats du test. La courbe progresse encore ; 1 200 représente donc une limite de budget expérimental, pas la preuve d'un optimum mathématique. La suite logique consiste à prolonger un run contrôlé, puis à sélectionner à nouveau sur validation.

La **train loss seule ne répond pas** à la question "quel checkpoint dois-je déployer ?". Elle mesure la capacité à prédire les tokens cibles sur les exemples d'entraînement. Elle peut continuer à baisser alors que :

- la généralisation plafonne
- le modèle mémorise certaines formulations
- la conformité JSON se dégrade
- des classes rares régressent
- la calibration devient moins bonne

Je sélectionne donc sur une métrique métier calculée par génération complète. Une accuracy token en teacher forcing n'est pas une accuracy d'intention : prédire correctement les accolades et les guillemets ne signifie pas avoir choisi le bon label.

<br/>

## Résultats sur le test gelé

Les trois méthodes du scénario ont été évaluées sur les mêmes 3 000 demandes du test gelé :

| Méthode | Accuracy | Macro-F1 | JSON valide |
|---|---:|---:|---:|
| `base-1.7B`, sans adaptation | 50,07 % | 49,11 % | 96,63 % |
| `base-1.7B` + LoRA | **92,00 %** | **91,98 %** | **99,97 %** |
| TF-IDF + régression logistique | 90,20 % | 90,17 % | 100 % |

Le gain apparié présenté dans le scénario est de **41,93 points d'accuracy**. Sur les 3 000 demandes :

- 1 286 erreurs du modèle de base ont été corrigées
- 28 réponses auparavant correctes ont régressé
- 1 686 réponses sont restées inchangées
- 240 erreurs subsistent après fine-tuning

Sur un véritable benchmark, je complète cette comparaison par un bootstrap apparié sur les prédictions individuelles. Je ne publie pas d'intervalle de confiance pour ASSURANCE60 : sans observations issues d'un run réel, une précision statistique supplémentaire serait artificielle.

L'accuracy et le macro-F1 sont presque identiques parce que le test synthétique contient exactement 50 exemples par classe. En production, la distribution sera rarement équilibrée. Je suivrais donc également le rappel par classe, le coût métier de chaque confusion et une matrice de confusion pondérée par les vrais volumes.

<br/>

## Ce que l'adaptation cherche à apprendre

L'amélioration la plus intéressante ne vient pas des intentions évidentes, mais des frontières fines de la taxonomie. Avant adaptation, le modèle avait tendance à choisir un label général :

- une question sur une indemnisation automobile devenait simplement `suivi_sinistre`
- un remboursement de santé en attente devenait `indemnisation_en_attente`
- une demande d'attestation habitation devenait une question sur les garanties du contrat
- une contestation de franchise devenait une demande d'explication générale sur la couverture

L'adaptation cherche à mieux distinguer l'objet, le produit, le canal et l'état du dossier. Elle doit apprendre la convention de labellisation spécifique au métier, alors que le modèle de base s'appuie surtout sur une similarité sémantique générale.

Les 28 régressions du scénario illustrent un autre point important. Certaines formulations restent réellement ambiguës : "mon remboursement prend beaucoup de temps" peut relever de `indemnisation_en_attente`, `remboursement_sante_en_attente` ou `pieces_sinistre_manquantes` selon le produit et le contexte absents. À ce stade, augmenter le rang ou le nombre de steps ne résout pas nécessairement le problème. Les options d'architecture deviennent :

- demander une clarification
- retourner un top-k avec scores
- définir une classe de rejet
- appliquer une règle métier sur les cas à fort risque
- envoyer les cas incertains à un opérateur

Un modèle qui répond toujours par l'une des 60 classes peut afficher une bonne accuracy tout en étant dangereux sur les demandes hors taxonomie. Le test suivant doit donc porter sur l'**out-of-scope detection**, explicitement absente du scénario ASSURANCE60.

<br/>

## Pourquoi la baseline classique reste essentielle

La régression logistique sur des features TF-IDF de caractères atteint 90,20 % dans le scénario. Le LoRA la dépasse de 1,80 point, mais cette différence ne constitue pas une supériorité statistiquement démontrée tant qu'elle n'est pas reproduite sur des prédictions réelles.

Pour un routeur pur, à très fort volume et avec une taxonomie stable, la baseline classique possède de sérieux avantages :

- latence faible et prévisible
- coût d'inférence minime
- comportement déterministe
- déploiement et explicabilité plus simples

Le LoRA devient plus intéressant si le même modèle doit ensuite extraire des attributs, comprendre plusieurs langues, gérer des formulations longues ou alimenter une chaîne générative. Le choix d'architecture doit intégrer l'ensemble du produit, pas seulement le meilleur score d'une colonne.

Ce point a changé ma manière de cadrer les projets GenAI : je demande systématiquement une baseline non-LLM. Sans elle, on sait que le fine-tuning améliore un LLM, mais pas que le LLM est nécessaire.

<br/>

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

- le commit Git et le lock des dépendances
- l'identifiant et la révision immuable du modèle de base
- le hash du dataset et les identifiants des partitions
- la seed
- la configuration LoRA
- le batch réellement utilisé
- les métriques train et validation par step
- les checkpoints
- les résultats de génération
- les matrices de confusion et les erreurs appariées
- les hashes SHA-256 des artefacts retenus

Je conserve aussi les échecs. Un run interrompu pour manque de mémoire ou une configuration qui produit du JSON invalide fait partie de l'historique expérimental. Supprimer ces traces crée une vision artificiellement linéaire de la recherche.

<br/>

## Le chemin jusqu'à la production

Je ne déploierais pas directement un adaptateur qui vient de gagner un benchmark. Le passage en production suit plusieurs portes :

1. **Gate de données** : provenance, licence, PII, conflits de labels, doublons et séparation des partitions.
2. **Gate offline** : macro-F1, rappel par intention, validité du contrat, latence, mémoire et robustesse sur paraphrases.
3. **Gate métier** : revue des confusions coûteuses et accord sur la politique de rejet.
4. **Shadow traffic** : le modèle observe du trafic réel sans piloter le routage.
5. **Canary** : exposition progressive à une petite part du trafic avec rollback immédiat.
6. **Monitoring** : dérive des entrées, distribution des intentions, taux de rejet, invalides JSON, latence et corrections humaines.

La prod doit pouvoir revenir au modèle précédent en changeant une référence d'artefact. Je garde la base et l'adaptateur séparés tant que j'ai besoin de charger plusieurs adaptations ou de revenir rapidement en arrière. Je ne fusionne les poids que si la simplification du serving ou la mesure de latence le justifie.

Le monitoring de la loss n'a plus de sens une fois le modèle en service. Il faut observer des proxys disponibles immédiatement, puis rattacher les labels métier lorsqu'ils arrivent. Une hausse soudaine de `sinistre_auto_non_reconnu` peut signaler une campagne de fraude, un incident dans le parcours de déclaration, un changement de vocabulaire ou une dérive du modèle. L'alerte doit déclencher une analyse, pas un réentraînement automatique.

<br/>

## Ce que je ferais ensuite

Le scénario montre où LoRA peut apporter de la valeur sur une taxonomie d'assurance fine. Il laisse plusieurs travaux indispensables avant toute conclusion sur un système réel :

- construire un test privé, récent et temporellement postérieur au train
- ajouter des exemples hors périmètre et mesurer le taux de faux routage
- évaluer la calibration et définir un seuil d'abstention
- comparer les rangs 8, 16 et 32 sous le même budget
> C'est-à-dire entraîner trois adaptateurs qui ne diffèrent que par leur rang LoRA, en conservant le même dataset, les mêmes partitions, la même seed, le même nombre d'exemples vus et le même protocole d'évaluation. Le rang contrôle la capacité de l'adaptateur : un rang plus élevé ajoute des paramètres entraînables et peut mieux apprendre des distinctions complexes, mais il consomme davantage de mémoire et peut surapprendre. L'objectif est de retenir le plus petit rang qui atteint une qualité comparable au meilleur résultat
- mesurer un LoRA attention-only face à attention + MLP
> C'est-à-dire comparer un adaptateur placé uniquement sur les projections d'attention (`q_proj`, `k_proj`, `v_proj`, `o_proj`) avec un adaptateur également placé sur les projections du MLP (`gate_proj`, `up_proj`, `down_proj`). La première variante entraîne moins de paramètres. La seconde donne au modèle plus de capacité pour transformer les représentations internes. La comparaison permet de vérifier si le gain de qualité justifie le coût supplémentaire en mémoire, en temps d'entraînement et en taille d'adaptateur
- tester QLoRA NF4 séparément, avec les mêmes seeds et partitions
- mesurer la latence et le débit dans le serveur d'inférence réel
> C'est-à-dire servir le modèle de base et l'adaptateur avec [vLLM 0.6.4](https://github.com/vllm-project/vllm/releases/tag/v0.6.4) puis lancer le script [`benchmarks/benchmark_serving.py`](https://github.com/vllm-project/vllm/blob/v0.6.4/benchmarks/benchmark_serving.py) provenant du même tag. Le test doit rejouer des prompts ASSURANCE60 représentatifs après une phase de chauffe, avec plusieurs niveaux de concurrence et de requêtes par seconde. Pour ce classifieur aux réponses très courtes, les métriques principales sont la latence de bout en bout aux percentiles p50, p95 et p99, le nombre de requêtes traitées par seconde et le taux d'erreur. Le TTFT, le temps par token et le débit en tokens par seconde restent utiles pour comparer le comportement du serveur, mais ils sont moins déterminants que les requêtes par seconde sur ce cas d'usage
- répéter l'expérience sur plusieurs seeds
- faire annoter les cas ambigus par plusieurs experts métier

Je travaillerais aussi sur la taxonomie. Lorsque deux labels ne peuvent pas être distingués de façon fiable à partir du texte disponible, le problème ne vient pas toujours du modèle. Il peut venir d'une définition métier trop subtile ou d'un manque de contexte dans l'interface.

<br/>

## Mon retour d'architecte

LoRA rend le fine-tuning accessible, mais la facilité de lancer un entraînement ne doit pas masquer la difficulté de prouver qu'il améliore le système.

Le passage de 50,07 % à 92,00 % sert ici à rendre le protocole concret ; il ne constitue pas un résultat de production. Ce qui rendrait un gain exploitable est le fait de geler le test, compter les sorties invalides comme des erreurs, comparer les prédictions une à une, conserver une baseline classique, sélectionner le checkpoint sur validation et versionner l'ensemble du contrat d'inférence.

La décision d'architecture reste conditionnelle :

- si le besoin est une classification pure à coût minimal, la baseline classique peut gagner
- si le produit a besoin de compréhension sémantique plus large et de sorties structurées, un petit LLM avec LoRA devient une option solide
- si la connaissance change fréquemment, il faut probablement compléter avec du retrieval
- si le coût d'une erreur est élevé, l'abstention et la revue humaine font partie du modèle de service

LoRA ne transforme pas un benchmark en produit. Il offre une manière efficace d'adapter le comportement d'un modèle. La valeur vient de la discipline appliquée autour : données, évaluation, traçabilité, serving et boucle de retour métier.

