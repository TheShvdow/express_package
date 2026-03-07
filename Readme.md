# simply-express

**CLI Express.js + TypeScript production-ready — en moins d'une minute.**

`@theshvdow/simply-express` génère un projet Express.js moderne avec Clean Architecture, Prisma v7, Zod, Swagger et un système d'authentification JWT complet — le tout via un CLI interactif.

---

## Démarrage rapide

```bash
# npm
npx @theshvdow/simply-express mon-api

# yarn
yarn dlx @theshvdow/simply-express mon-api

# pnpm
pnpm dlx @theshvdow/simply-express mon-api

# bun
bunx @theshvdow/simply-express mon-api
```

---

## Deux modes disponibles

### Minimal

Un projet Express + TypeScript propre avec les options de ton choix :

- Prisma v7 + PostgreSQL (docker-compose inclus)
- Zod — validation des données
- Swagger / OpenAPI

### Starter Kit Auth

Tout le mode Minimal + un système d'authentification JWT complet, prêt à l'emploi :

```text
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me        (Authorization: Bearer <token>)
```

Inclut : bcrypt, jsonwebtoken, Zod validators, middleware auth, Prisma User model.

---

## Structure générée

```
src/
├─ application/
│  └─ services/
├─ core/
│  ├─ errors/
│  ├─ swagger/          (si Swagger activé)
│  └─ usecases/
├─ infrastructure/
│  ├─ http/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  └─ routers/
│  ├─ prisma/           (si Prisma activé)
│  └─ validators/
├─ utils/
│  └─ logger.ts         (Pino JSON)
├─ app.ts
└─ server.ts
```

---

## Prérequis

| Outil           | Version                            |
| --------------- | ---------------------------------- |
| Node.js         | >= 20.19.0 (requis par Prisma v7)  |
| Package manager | npm · yarn · pnpm · bun            |
| Docker          | Optionnel — pour PostgreSQL local  |

---

## Scripts disponibles

```bash
npm run dev      # Démarre avec hot-reload (nodemon / bun --watch)
npm run build    # Compile TypeScript → dist/
npm start        # Lance le build de production
```

---

## Premiers pas après génération

**Mode Minimal avec Prisma :**

```bash
cd mon-api
cp .env.example .env
docker compose up -d
npx prisma generate
npm run dev
```

**Starter Kit Auth :**

```bash
cd mon-api
cp .env.example .env
# Définir JWT_SECRET dans .env
docker compose up -d
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Swagger UI disponible sur `http://localhost:8000/api-docs` (si activé).

---

## Ce qui est inclus

| Fonctionnalité              | Minimal   | Starter Kit Auth |
| --------------------------- | --------- | ---------------- |
| Express + TypeScript        | ✔         | ✔                |
| Clean Architecture          | ✔         | ✔                |
| Pino logger JSON            | ✔         | ✔                |
| Prisma v7 + PrismaPg        | optionnel | ✔                |
| Docker Compose PostgreSQL   | optionnel | ✔                |
| Zod validation              | optionnel | ✔                |
| Swagger / OpenAPI           | optionnel | ✔                |
| Auth JWT (register/login/me)| ✗         | ✔                |
| bcrypt + middleware Bearer  | ✗         | ✔                |

---

## Contribution

Issues et PRs bienvenus sur [GitHub](https://github.com/TheShvdow/express_package).

---

## Licence

MIT — © 2025 [TheShvdow](https://github.com/TheShvdow)
