# Workspace Quest V1 — AZ Consulting Pédagogie

Application pédagogique autonome (`index.html`) pour les classes 2EPC, 1MCVA, 2nde Pro et BTS 1 MOS.

## Pour tester

Ouvrir `index.html` dans un navigateur moderne sur ordinateur. Aucun serveur ni installation n'est nécessaire pour les quiz et les cours. Les liens Google ouvrent les services externes et demandent un compte compatible.

## Ce qui fonctionne dans la V1

- 12 modules indépendants (Gmail, outils, Drive, partage, ressources, Docs, Sheets, Forms, Slides, Agenda, défi final, lexique).
- Cours théoriques en français, guides Google officiels, missions pratiques à cocher.
- 26 questions QCU/QCM avec 4 propositions, explications, indices, points non répétables.
- 24 définitions de vocabulaire.
- Sélection de classe et arborescence adaptée.
- Sauvegarde locale des étapes, réponses et points ; export CSV individuel.
- Configuration locale des adresses enseignant/Hanout et ressources.

## Limites à connaître

- Les manipulations Drive/Docs/etc. sont guidées mais non vérifiées automatiquement : les cases et missions sont déclaratives.
- Les Google Forms de validation ne sont pas encore créés ni liés à l'application ; les notes ne sont pas envoyées par e-mail automatiquement.
- L'enseignant ne dispose pas encore d'un tableau de bord centralisé. Chaque élève peut exporter son CSV.
- La progression n'est pas synchronisée entre appareils ni entre comptes.
- Les adresses institutionnelles et les liens de cours doivent être ajoutés plus tard.
- Aucun mot de passe ne doit être saisi ou partagé dans l'application.

## Déploiement GitHub Pages

1. Créer un dépôt **public distinct** intitulé `workspace-quest` dans le compte GitHub **AZDEZED**.
2. Ajouter `index.html` à la racine, sur `main`.
3. Dans Settings → Pages → Build and deployment, choisir Deploy from a branch puis `main` et `/ (root)`.
4. Vérifier l'URL annoncée par GitHub Pages, puis tester les modules et les liens depuis ordinateur et téléphone.

Ne pas recopier les données personnelles ni l'historique local des élèves dans un dépôt public.

## Références officielles
- https://support.google.com/a/users/answer/9389764?hl=fr
- https://support.google.com/drive/answer/7166529?hl=fr
- https://support.google.com/docs/answer/7032287?hl=fr
