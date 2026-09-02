# Comment j'organise mes projets de data science ?

- Canonical URL: https://leandeep.com/comment-jorganise-mes-projets-de-data-science/
- Author: Olivier Eeckhoutte
- Published: 2018-09-27T13:22:00Z
- Updated: 2018-09-27T13:22:00Z
- Language: fr
- Tags: Machine Learning, data
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

J'ai travaillé sur multiples projets de développement et clairement ceux qui fonctionnent le mieux sont ceux qui sont les plus structurés que ce soit en terme de:
- Méthodologie et d'organisation d'équipe (Agile)
- Mindset 
- Pratiques de développement (TDD, refactoring, pair programing) 
- une bonne usine logiciel (CircleCI, Gitlab CI, tests unitaires et e2e auto, monitoring...)
- bon staffing 

A chaque fois qu'il y avait ces 5 composantes, le projet était couronné de succès. Finalement c'est assez simple, il suffit de réappliquer toutes ces bonnes pratiques et cela tourne. 

Lorsque j'ai commencé à travailler sur de la data science avec les outils d'exploration type Jupyter Notebook, j'ai été dérouté. 
Comment gérer les données dans le projet ? Git n'accepte pas plus de 100 Mo (et puis cela devient lourd) Comment faire en sorte que l'on puisse reproduire les résultats (immutabilité des données) ? 
Comment faire des merges avec des fichiers json illisibles de Jupyter ?  
Comment moins attendre ? En effet, les traitements sont longs car les volumes de données sont conséquents. 

Tout comme en développement il existe des guidelines. Par exemples, les développeurs JS pourront vous citer les guidelines de Johnpapa (https://github.com/johnpapa/angular-styleguide) ou d'Airbnb (https://github.com/airbnb/javascript) dont certaines sont directement comprises dans des outils de scaffoling (Yeoman) ou d'analyse de code (Eslint). 

J'ai trouvé les guideline suivante: http://drivendata.github.io/cookiecutter-data-science. Je partage totalement le choix des outils présentés et la structuration proposée. Je l'utilise pour mes projets et suis très satisfait. 

N'hésitez pas à me contacter si vous pensez que ces pratiques sont mauvaises. Je suis friand de ce genre de débat.

