# 📦 create-express-app  

### Générateur professionnel de projets **Express.js + TypeScript + Prisma + Zod + Swagger**

`@theshvdow/create-express-app` est un CLI complet permettant de créer en quelques secondes un projet Express.js moderne, structuré, scalable et prêt pour la production.
Il inclut :

- 🚀 Express.js + TypeScript  
- 🏗️ Architecture modulaire (controllers, services, repositories)
- 🛡️ Zod pour la validation
- 🗄️ Prisma (optionnel)
- 📘 Swagger / OpenAPI généré automatiquement
- 🧪 Tests intégrés
- 🛠️ CLI interactif
- 🐳 Dockerfile prêt à l’emploi

---

## 📥 Installation

Ne pas Utiliser `npm i @theshvdow/create-express-app` pour installer ce package il fonctionnera pas.

Au lieu de cela, utilisez `npx` pour exécuter le générateur directement sans installation globale :

```bash
npx @theshvdow/create-express-app <nom-du-projet>
```

---

## 🚀 Utilisation

```bash
npx @theshvdow/create-express-app <nom-du-projet>
```

Vous serez guidé par une série de questions :

- Nom du projet

- Choix du gestionnaire de package (npm / yarn / pnpm)

- Activer Prisma ? (oui / non)

- Activer Zod ? (oui / non)

- Installer Swagger ? (oui / non)

### Structure du projet
Après l’exécution, vous obtiendrez une structure de projet comme suit :
```
    
    
    src/
    ├─ application/
    │  └─ services/
    │     └─ UserService.ts
    ├─ core/
    │  ├─ entities/
    │  │  └─ User.ts
    │  ├─ errors/
    │  │  └─ AppError.ts
    │  ├─ swagger/
    │  │  ├─ schemas/
    │  │  │  └─ common.schemas.ts
    │  │  ├─ index.ts
    │  │  └─ swagger.config.ts
    │  └─ usecases/
    │     └─ CreateUserUseCase.ts
    ├─ infrastructre/
    │  ├─ http/
    │  │  ├─ controllers/
    │  │  │  └─ UserController.ts
    │  │  ├─ middleware/
    │  │  │  ├─ ErrorHandler.ts
    │  │  │  └─ validator.ts
    │  │  └─ routers/
    │  │     ├─ index.ts
    │  │     └─ user.routes.ts
    │  ├─ prisma/
    │  │  ├─ client.ts
    │  │  └─ UserRepositoryPrisma.ts
    │  └─ validators/
    │     └─ UserValidator.ts
    ├─ public/
    │  └─ .gitkeep
    ├─ types/
    │  └─ UserRepository.ts
    ├─ utils/
    │  └─ logger.ts
    ├─ app.ts
    └─ server.ts



Si Prisma est activé :
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
``` 

### ⚙️ Requirements

- Node.js v14 ou supérieur
- npm, yarn ou pnpm
- prisma (si activé) v6.X
- Zod (si activé) v3.X
- Swagger (si activé) v6.X

---
## Scripts disponibles
- `npm run dev` : Démarrer le serveur en mode développement avec rechargement à chaud
- `npm run build` : Compiler le projet TypeScript
- `npm start` : Démarrer le serveur en mode production
- `npm run lint` : Linter le code avec ESLint
- `npm run test` : Exécuter les tests unitaires
- `npm run swagger` : Générer la documentation Swagger (si Swagger est activé)
- `npm run prisma:generate` : Générer le client Prisma (si Prisma est activé)
- `npm run prisma:migrate` : Appliquer les migrations Prisma (si Prisma est activé)

### Swagger UI
Si Swagger est activé, la documentation sera accessible à l’adresse : `http://localhost:3000/api-docs`

---
## 💡 Personnalisation
Vous pouvez facilement personnaliser et étendre le projet selon vos besoins. La structure modulaire facilite l’ajout de nouvelles fonctionnalités, routes, services, etc.

---
## 🤝 Contribution
Les contributions sont les bienvenues ! N’hésitez pas à ouvrir des issues ou des pull requests pour améliorer ce projet.

---

### Support
Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub.
👉 https://www.npmjs.com/package/@theshvdow/create-express-project

## 📄 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

All rights reserved © 2024 TheShvdow

### Merci d’utiliser `@theshvdow/create-express-project` ! 🚀