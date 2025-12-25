# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à **@theshvdow/create-express-app** ! Ce document vous guidera à travers le processus de contribution au projet.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Configurer l'environnement de développement](#configurer-lenvironnement-de-développement)
- [Structure du projet](#structure-du-projet)
- [Standards de code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Rapporter des bugs](#rapporter-des-bugs)
- [Proposer des fonctionnalités](#proposer-des-fonctionnalités)
- [Questions fréquentes](#questions-fréquentes)

---

## 📜 Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite. Nous nous engageons à fournir un environnement accueillant et inclusif pour tous.

### Nos standards

- Utiliser un langage accueillant et inclusif
- Respecter les points de vue et expériences différents
- Accepter gracieusement les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté
- Faire preuve d'empathie envers les autres membres de la communauté

---

## 🚀 Comment contribuer

### ⚠️ Règle importante : Créer une Issue avant de contribuer

**Avant de commencer à travailler sur une contribution, vous DEVEZ créer une issue** pour :

1. **Discuter de votre idée** avec les mainteneurs
2. **Éviter les doublons** et le travail inutile
3. **Obtenir des retours** sur l'approche à adopter
4. **Coordonner** avec d'autres contributeurs potentiels

**Exception** : Pour les corrections mineures (fautes de frappe, petites améliorations de documentation), vous pouvez directement soumettre une PR.

### Processus recommandé

1. **Créez une issue** décrivant votre proposition
2. **Attendez la validation** d'un mainteneur (commentaire "go ahead" ou assignation de l'issue)
3. **Commencez le développement** seulement après validation
4. **Soumettez votre PR** en référençant l'issue (#numéro)

> ⚡ **Important** : Les Pull Requests sans issue associée risquent d'être fermées sans examen.

---

### Façons de contribuer

Il existe plusieurs façons de contribuer au projet :

### 1. Rapporter des bugs

Ouvrez une issue en décrivant le problème rencontré avec le maximum de détails.

### 2. Proposer des améliorations

Partagez vos idées pour améliorer le projet via une issue.

### 3. Améliorer la documentation

Corrigez les fautes, clarifiez les explications ou ajoutez des exemples.

### 4. Soumettre du code

Corrigez des bugs, implémentez de nouvelles fonctionnalités ou optimisez le code existant.

---

## 🛠️ Configurer l'environnement de développement

### Prérequis

- **Node.js** v14 ou supérieur
- **npm**, **yarn** ou **pnpm**
- **Git**
- Un éditeur de code (VS Code recommandé)

### Installation

1. **Forkez le repository** sur GitHub

2. **Clonez votre fork** localement :

```bash
git clone https://github.com/votre-username/express_package.git
cd express_package
```

1. **Ajoutez le repository original comme remote** :

```bash
git remote add upstream https://github.com/TheShvdow/express_package.git
```

1. **Installez les dépendances** :

```bash
npm install
```

1. **Créez une branche** pour votre contribution :

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### Tester localement

Pour tester le CLI localement sans le publier :

1. **Liez le package globalement** :

```bash
npm link
```

1. **Testez le générateur** :

```bash
npx @theshvdow/create-express-app test-project
# ou si npm link est actif
create-express-app test-project
```

1. **Vérifiez les fichiers générés** dans le dossier `test-project/`

2. **Pour délier le package** :

```bash
npm unlink -g @theshvdow/create-express-app
```

---

## 📁 Structure du projet

```
express_package/
├── .vscode/
│   └── settings.json       # Configuration VS Code
├── bin/
│   └── cli.js              # Point d'entrée du CLI
├── templates/              # Templates de fichiers générés
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── application/    # Couche application (services)
│   │   ├── core/           # Entités, erreurs, swagger, use cases
│   │   ├── infrastructure/ # HTTP, prisma, validators
│   │   ├── public/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package.json
│   ├── README.md
│   ├── requests.http
│   └── tsconfig.json
├── package.json            # Configuration du package npm
└── Readme.md               # Documentation principale
```

### Composants clés

- **`bin/cli.js`** : Script exécutable du CLI qui lance le générateur
- **`templates/`** : Contient tous les fichiers templates qui seront copiés dans le projet généré
- **`templates/src/`** : Structure complète de l'application Express générée (architecture en couches)
- **`package.json`** : Configuration npm avec les dépendances et scripts du générateur

---

## ✨ Standards de code

### Style de code

- **TypeScript** : Utiliser TypeScript pour tout nouveau code
- **Indentation** : 2 espaces
- **Quotes** : Utiliser des guillemets simples `'`
- **Point-virgule** : Obligatoire à la fin de chaque instruction
- **Nommage** :
  - Variables et fonctions : `camelCase`
  - Classes et interfaces : `PascalCase`
  - Constants : `UPPER_SNAKE_CASE`

### Linting

Assurez-vous que votre code passe le linter avant de soumettre :

```bash
npm run lint
```

Pour corriger automatiquement les erreurs :

```bash
npm run lint:fix
```

### Tests

Tous les nouveaux codes doivent inclure des tests appropriés :

```bash
npm test
```

Pour les tests avec couverture :

```bash
npm run test:coverage
```

### Commits

Suivez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(scope): description courte

[corps optionnel]

[footer optionnel]
```

**Types de commits** :

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Modification de documentation
- `style`: Formatage, point-virgules manquants, etc.
- `refactor`: Refactorisation du code
- `test`: Ajout ou modification de tests
- `chore`: Maintenance, dépendances, etc.

**Exemples** :

```bash
git commit -m "feat(cli): add option to skip Prisma installation"
git commit -m "fix(generator): resolve template path issue on Windows"
git commit -m "docs(readme): update installation instructions"
git commit -m "feat(template): add Docker support"
```

### Travailler avec les templates

Lors de la modification des fichiers dans `templates/`, gardez à l'esprit :

1. **Cohérence** : Assurez-vous que tous les templates suivent la même architecture et conventions
2. **Placeholders** : Utilisez des placeholders cohérents pour les valeurs dynamiques (nom du projet, etc.)
3. **Documentation** : Les templates doivent être auto-documentés avec des commentaires clairs
4. **Testabilité** : Testez toujours le projet généré pour vous assurer qu'il fonctionne correctement
5. **Options conditionnelles** : Si vous ajoutez du code lié à Prisma/Zod/Swagger, assurez-vous qu'il respecte les options du CLI

---

## 🔄 Processus de Pull Request

### ⚠️ Prérequis : Issue obligatoire

**Toute Pull Request doit être liée à une issue existante** (sauf pour les corrections mineures de documentation).

- Mentionnez l'issue dans votre PR : `Fixes #123` ou `Closes #456`
- Si vous n'avez pas créé d'issue, créez-en une d'abord et attendez la validation

### Avant de soumettre

1. **Synchronisez votre fork** avec le repository principal :

```bash
git fetch upstream
git rebase upstream/main
```

1. **Vérifiez que tous les tests passent** :

```bash
npm test
```

1. **Vérifiez le linting** :

```bash
npm run lint
```

1. **Testez manuellement** votre changement avec le CLI

### Soumettre la Pull Request

1. **Poussez votre branche** :

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

1. **Créez une Pull Request** sur GitHub

2. **Remplissez le template** de PR avec :
   - Description claire des changements
   - Motivation et contexte
   - Types de changements (bug fix, nouvelle fonctionnalité, etc.)
   - Checklist des vérifications effectuées
   - Screenshots si applicable

### Template de Pull Request

```markdown
## Issue associée
Closes #(numéro de l'issue)

## Description
Décrivez vos changements en détail.

## Motivation et contexte
Pourquoi ce changement est-il nécessaire ? Quel problème résout-il ?

## Type de changement
- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (correction ou fonctionnalité qui causerait un dysfonctionnement des fonctionnalités existantes)
- [ ] Documentation

## Comment a-t-il été testé ?
Décrivez les tests que vous avez effectués.

## Checklist
- [ ] Une issue existe et a été validée par un mainteneur
- [ ] Mon code suit le style du projet
- [ ] J'ai effectué une auto-revue de mon code
- [ ] J'ai commenté mon code, notamment dans les zones difficiles
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que ma correction est efficace ou que ma fonctionnalité fonctionne
- [ ] Les tests unitaires nouveaux et existants passent localement
```

### Revue de code

- Soyez patient, les mainteneurs examineront votre PR dès que possible
- Répondez aux commentaires et suggestions
- Apportez les modifications demandées
- Une fois approuvée, votre PR sera mergée par un mainteneur

---

## 🐛 Rapporter des bugs

### Avant de rapporter

1. **Vérifiez les issues existantes** pour éviter les doublons
2. **Assurez-vous d'utiliser la dernière version** du package
3. **Testez avec les versions minimales requises** de Node.js

### Template d'issue pour un bug

```markdown
**Describe the bug**
Description claire et concise du bug.

**To Reproduce**
Étapes pour reproduire le comportement :
1. Exécuter '...'
2. Avec les options '....'
3. Voir l'erreur

**Expected behavior**
Description de ce qui devrait se passer.

**Screenshots**
Si applicable, ajoutez des captures d'écran.

**Environment:**
 - OS: [e.g. macOS 14.0, Windows 11, Ubuntu 22.04]
 - Node version: [e.g. 18.17.0]
 - Package version: [e.g. 1.0.0]
 - Package manager: [npm/yarn/pnpm]

**Additional context**
Tout autre contexte pertinent.
```

---

## 💡 Proposer des fonctionnalités

### Types de contributions possibles

**Améliorations du CLI** :

- Nouvelles options interactives
- Support de nouveaux gestionnaires de packages
- Amélioration des messages et de l'UX
- Validation des entrées utilisateur

**Améliorations des templates** :

- Nouvelles intégrations (bases de données, services, etc.)
- Amélioration de l'architecture
- Ajout de patterns et best practices
- Support de nouveaux frameworks ou librairies

**Documentation** :

- Tutoriels et guides
- Exemples d'utilisation
- Traductions
- Amélioration du README

### Template d'issue pour une fonctionnalité

```markdown
**Is your feature request related to a problem?**
Description claire du problème. Ex: "Je suis toujours frustré quand [...]"

**Describe the solution you'd like**
Description claire de ce que vous souhaitez.

**Describe alternatives you've considered**
Description des solutions alternatives envisagées.

**Additional context**
Tout autre contexte, captures d'écran, exemples de code.
```

---

## ❓ Questions fréquentes

### Dois-je vraiment créer une issue avant chaque contribution ?

Oui, sauf pour :

- Les corrections de fautes de frappe
- Les petites améliorations de documentation
- Les corrections de formatage évidents

Pour toute autre contribution (fonctionnalités, bug fixes majeurs, refactoring), créez d'abord une issue.

### Comment puis-je tester mes changements localement ?

Utilisez `npm link` pour tester le CLI localement sans publier sur npm.

### Puis-je travailler sur plusieurs features simultanément ?

Oui, mais créez une branche séparée pour chaque feature pour faciliter les revues.

### Combien de temps faut-il pour qu'une PR soit revue ?

Les mainteneurs font de leur mieux pour examiner les PRs dans les 3-7 jours. Pour les bugs critiques, la revue peut être plus rapide.

### Mon PR a été refusée, que faire ?

Ne vous découragez pas ! Lisez attentivement les commentaires, apportez les modifications suggérées, ou discutez de l'approche alternative proposée.

---

## 📞 Contact

- **Issues GitHub** : [https://github.com/TheShvdow/express_package/issues](https://github.com/TheShvdow/express_package/issues)
- **NPM Package** : [https://www.npmjs.com/package/@theshvdow/create-express-app](https://www.npmjs.com/package/@theshvdow/create-express-app)
- **Email** : *À ajouter si disponible*
- **Discord/Slack** : *À ajouter si disponible*

---

## 📜 Licence

En contribuant à ce projet, vous acceptez que vos contributions soient sous licence MIT.

---

## 🙏 Remerciements

Merci à tous les contributeurs qui aident à améliorer **@theshvdow/create-express-app** !

---

## 🎯 Récapitulatif du workflow de contribution

1. ✅ **Créer une issue** pour discuter de votre idée
2. ⏳ **Attendre la validation** d'un mainteneur
3. 🔧 **Forker et coder** votre contribution
4. ✔️ **Tester** localement
5. 📝 **Créer une PR** liée à l'issue
6. 🔍 **Révision** et ajustements
7. 🎉 **Merge** de votre contribution !

> 💡 **Rappel** : Une issue validée = gain de temps pour tout le monde !

---

**Prêt à contribuer ? Forkez le projet et commencez dès maintenant ! 🚀**
