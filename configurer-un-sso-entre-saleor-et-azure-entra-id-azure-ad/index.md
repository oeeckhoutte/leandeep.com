# Configurer un SSO entre Saleor et Azure Entra ID (Azure AD)

- Canonical URL: https://leandeep.com/configurer-un-sso-entre-saleor-et-azure-entra-id-azure-ad/
- Author: Olivier Eeckhoutte
- Published: 2023-12-22T18:21:00Z
- Updated: 2023-12-22T18:21:00Z
- Language: fr
- Tags: Saleor, Azure, AD, Entra
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article nous allons voir comment configurer Saleor pour pouvoir se connecter au dashboard via Single Sign On (SSO) avec Azure Entra ID (anciennement Azure Active Directory).

## Pré-requis

- Avoir un compte Azure Portal
- Une instance de Saleor exposée sur internet

<br/>

## Configuration d'Azure Entra ID

Personnellement je suis connecté à Azure avec une adresse gmail. Cela devrait fonctionner avec tout autre domaine.

Rendez-vous sur le portail Azure et cliquer sur `Microsoft Entra ID`.
Si vous vous rendez dans la section users via le menu de gauche, vous devriez voir votre adresse email. Vérifier que c'est le cas car nous allons nous connecter avec cette adresse email dans le process de SSO.

Retourner sur la home page d'Azure Entra ID:

![image](/images/azure-entra-id-home.png)

<br/>

Cliquer sur le bouton `Add` -> `App Registration`

Indiquer un nom à votre app. Dans mon cas j'ai mais `Saleor OIDC dev`.

Ensuite, pour `Supported account types` laissez le bouton radio sélectionné par défaut.

Puis dans `Redirect URI (optional)`, sélectionner `Web` comme plateforme et indiquez l'URL de redirection de votre dashboard Saleor. Dans mon cas: `https://blablabla.saleor.cloud/dashboard/login/callback/`.

<br/>

Une fois votre application enregistrée, cliquer sur le bouton `overview` dans le menu de gauche sur la page Entra ID du portail Azure et cliquer sur le bouton `endpoints` tout en haut de la page.

![image](/images/azure-entra-id-endpoints.png)

La liste de ces endpoints est utile pour pouvoir configurer Saleor.

<br/>

## Configuration de Saleor

Rendez-vous donc dans le dashboard de Saleor via votre compte admin.

![image](/images/saleor-dashboard-home.png)

Et cliquez sur le bouton configurer en bas à gauche dans le menu.

<br/>

Tout en bas de la page configuration, cliquez sur le bouton plugins:

![image](/images/saleor-dashboard-config-page.png)

<br/>

Editer le plugin appelé `Openid Connect` et configurer le plugin:

- Activer la case `Set plugin as active`.
- En client ID, entrer la client ID de l'app que vous venez d'enregistrer dans Entra ID.
- Dans `OAuth Authorization URL`, entrer une URL du type: `https://login.microsoftonline.com/blablabla-bla-bla-bla-blablabla/oauth2/v2.0/authorize`. (Vous trouverez cette URL dans Entra ID dans la liste des endpoints dont on a parlé plus haut. Idem pour les URLs qui suivent)
- Dans `OAuth Token URL`, entrer une URL du type `https://login.microsoftonline.com/blablabla-bla-bla-bla-blablabla/oauth2/v2.0/token`
- Dans `JSON Web Key Set URL`, entrer une URL du type `https://login.microsoftonline.com/blablabla-bla-bla-bla-blablabla/discovery/v2.0/keys`
- Dans `OAuth logout URL`, entrer une URL du type `https://login.microsoftonline.com/blablabla-bla-bla-bla-blablabla/oauth2/v2.0/logout`
- Dans `User info URL`, entrer une URL du type `https://graph.microsoft.com/oidc/userinfo`
- N'indiquer rien dans Audience
- Garder `Use OAuth scope permissions` désactivé
- Pour `Staff user domains`, indiquer gmail.com si comme moi vous avez votre email gmail configurée comme User dans Entra.
- Dans Default Permission grous name for staff users, indiquez ce que vous voulez. Dans Saleor vous avez la possibilité de créer des groupes d'utilisateurs avec des rôles particuliers. Dans mon cas j'ai créé un groupe appelé `SSO` dans Saleor. C'était pour un test, donc ici j'ai indiqué `SSO`.

<br/>

Enfin pour `Authorization` ->  `Client secret`, il vous faudra un secret dans Entra ID.
Je me suis fait avoir car il y a 2 valeurs possibles de secret dans Entra ID. Il faut utiliser la `value` et pas le `Secret ID`.

![image](/images/entra-secret-value-for-registered-app.png)

Générer donc un secret dans Entra et insérer le dans Saleor.

Et voilà. Il ne vous reste plus qu'à vous connecter à votre instance de Saleor, de cliquer sur le bouton `OpenID connect` et de vous logguer à Azure portal.

![image](/images/saleor-login.png)

<br/>

![image](/images/azure-login-openid-connect.jpg)

<br/>

![image](/images/saleor-logged.png)

