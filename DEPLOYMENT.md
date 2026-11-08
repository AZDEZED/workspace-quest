# Workspace Quest V2 : validation et suivi

## État de la version de travail

Le classeur privé de suivi a été créé et vérifié. Le projet Apps Script a été créé et son code enregistré.
L’installation des formulaires attend l’autorisation Google du propriétaire du projet. Google affiche l’avertissement « application non validée » pour ce nouveau script.
Les quatre Google Forms ne sont donc pas encore créés. Le service n’est pas encore déployé et `tracking.js` conserve volontairement `__DEPLOYMENT_URL__`.
Ne pas fusionner cette branche sur `main` avant d’avoir remplacé cette valeur et validé une remise réelle.

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

1. Dans le projet Apps Script dédié, autoriser les services Forms, Sheets et les déclencheurs nécessaires à `installer` après examen de l’avertissement Google.
2. Exécuter `installer`. Contrôler les quatre Forms et les liens dans l’onglet Ressources. Ne pas rendre public le classeur.
3. Dans les paramètres de chaque Forms, vérifier le mode questionnaire, l’accès répondant sans connexion imposée et l’affichage des points et corrections.
4. Déployer le projet en application Web exécutée par son propriétaire et accessible aux répondants. Ce service ne doit jamais proposer une lecture des données personnelles.
5. Remplacer `__DEPLOYMENT_URL__` dans `tracking.js` par l’URL `/exec` retournée par Google.
6. Tester sur une version de prévisualisation : profil fictif, QCU juste/faux, QCM incomplet/complet, accusés de réception, retour en ligne après coupure, points non doublés et synthèse privée.
7. Remettre au moins une validation depuis son lien répondant. Vérifier le score natif et la réception du déclencheur dans Validations et Suivi. Effacer uniquement les données fictives de test.
8. Vérifier l’affichage sur petit écran. Fusionner uniquement après ces contrôles, puis vérifier GitHub Pages.

## Tests locaux

`node apps-script/test-service.cjs` vérifie la logique avec des services Google simulés : doublons d’événements et de réponses Forms, QCU, QCM, total du temps par séance, déclaration conditionnée à la checklist, identité invalide, neutralisation des formules saisies et remontée des scores dans la synthèse.

Ces contrôles ne remplacent pas la vérification réelle de Google Forms, des autorisations, du transport réseau et des déclencheurs.
