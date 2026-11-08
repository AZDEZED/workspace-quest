# Workspace Quest V2 — AZ Consulting Pédagogie

Application pédagogique pour 2EPC, 1MCVA, 2nde Pro et BTS 1 MOS.

## Fonctions actives

- 12 modules, cours en français, missions guidées, 26 questions corrigées et 24 définitions.
- Sauvegarde locale des quiz, étapes et points. Export CSV individuel.
- Quatre Google Forms de validation : 6, 7, 8 et 5 questions.
- Liens de validation sur le tableau de bord et dans les modules concernés.
- Préremplissage du nom, du prénom et de la classe depuis le profil.
- Score et explications visibles dans Forms après l’envoi.
- Résultats des Forms centralisés automatiquement dans un classeur enseignant privé.

## Limites actuelles

Les connexions, la progression locale et le temps actif ne sont pas encore transmis automatiquement. Le service Apps Script prévu pour cette fonction n’est pas déployé, dans l’attente d’une autorisation explicite pour son point de réception public. `index.html` charge uniquement `validations.js`. Le fichier `tracking.js` n’est pas utilisé.

Les productions Drive et les cases cochées restent déclaratives. Le suivi des résultats Forms repose sur le nom, le prénom et la classe saisis : l’identité n’est pas authentifiée. La progression locale ne se synchronise pas entre appareils.

Les réponses fictives de vérification sont identifiées par TEST TECHNIQUE / Fictif. Elles sont distinctes des données des élèves.

## Validation effectuée

Les quatre liens répondants ont été ouverts et testés par remise fictive. Scores reçus dans le tableau privé : 6/6, 6/7 (une erreur volontaire), 8/8 et 5/5. Le corrigé visible de la deuxième validation a été contrôlé.

Tests locaux de logique du service : doublons, QCU/QCM, temps par séance, checklist, identité, neutralisation des formules et synthèse.

Le suivi de connexion et de temps restera à tester de bout en bout après son autorisation et son déploiement. Voir DEPLOYMENT.md.

