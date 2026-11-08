# Workspace Quest V2 : validation et suivi

## État réel au 8 novembre 2026

Les quatre Google Forms sont créés, publiés et reliés par déclencheurs au classeur privé. Les scores, les bonnes réponses et les explications sont publiés immédiatement après l’envoi.

Quatre remises fictives ont été reçues dans le classeur : 6/6, 6/7 (une erreur volontaire), 8/8 et 5/5. Ces réponses portent le nom TEST TECHNIQUE et le prénom Fictif. Le corrigé visible du deuxième formulaire a été contrôlé.

L’application charge `validations.js`, qui affiche les liens Forms et préremplit le nom, le prénom et la classe. `tracking.js` n’est pas chargé et conserve `__DEPLOYMENT_URL__`.

La publication du service Apps Script avec l’audience « Tout le monde » a été refusée par le contrôle automatique : une autorisation explicite distincte reste nécessaire pour ce point de réception public. Les connexions, le temps actif et la progression locale ne sont donc pas envoyés automatiquement. Aucun tableau d’élèves n’est public.

## Contenu

- Nom, prénom et classe exigés avant le suivi. Identité déclarative, sans authentification forte.
- Quatre validations Google Forms : 6, 7, 8 et 5 questions. Reprise des 26 questions de la V1, avec corrigés et explications.
- Synthèse privée par élève, détail des modules, journal des transmissions et résultats Forms.
- Estimation du temps actif : page visible et interaction récente. Ce temps ne prouve pas le travail réel et peut être sous-estimé après une longue période hors ligne.
- Envois conservés sur l’appareil jusqu’à confirmation de réception. Les identifiants d’événement empêchent les doublons lors des nouvelles tentatives.
- Les quiz sont corrigés à nouveau côté service. Les manipulations sont déclaratives.
- L’interface ne peut ni lire le classeur ni obtenir les résultats d’un autre élève. Les seules lectures publiques sont les liens Forms et l’accusé de réception d’un événement identifié par un UUID aléatoire.
- La reprise de progression entre appareils n’est pas prévue dans cette version. Les remontées portant le même nom, prénom et classe sont regroupées dans le tableau enseignant.
- Aucun envoi automatique d’e-mail n’est installé.

## Mise en service

1. Les permissions Forms, Sheets et déclencheurs ont été accordées et `installer` a été exécuté avec succès.
2. Exécuter `installer`. Contrôler les quatre Forms et les liens dans l’onglet Ressources. Ne pas rendre public le classeur.
3. Dans les paramètres de chaque Forms, vérifier le mode questionnaire, l’accès répondant sans connexion imposée et l’affichage des points et corrections.
4. Déployer le projet en application Web exécutée par son propriétaire et accessible aux répondants. Ce service ne doit jamais proposer une lecture des données personnelles.
5. Remplacer `__DEPLOYMENT_URL__` dans `tracking.js` par l’URL `/exec` retournée par Google. Remplacer ensuite le chargement de `validations.js` par celui de `tracking.js` dans index.html, après avoir conservé le préremplissage de la classe corrigé.
6. Tester sur une version de prévisualisation : profil fictif, QCU juste/faux, QCM incomplet/complet, accusés de réception, retour en ligne après coupure, points non doublés et synthèse privée.
7. Remettre au moins une validation depuis son lien répondant. Vérifier le score natif et la réception du déclencheur dans Validations et Suivi. Effacer uniquement les données fictives de test.
8. Vérifier l’affichage sur petit écran. Fusionner uniquement après ces contrôles, puis vérifier GitHub Pages.

## Tests locaux

`node apps-script/test-service.cjs` vérifie la logique avec des services Google simulés : doublons d’événements et de réponses Forms, QCU, QCM, total du temps par séance, déclaration conditionnée à la checklist, identité invalide, neutralisation des formules saisies et remontée des scores dans la synthèse.

Ces contrôles ne remplacent pas la vérification réelle de Google Forms, des autorisations, du transport réseau et des déclencheurs.
