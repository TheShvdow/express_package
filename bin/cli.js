#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// chemin vers /templates
const templatesDir = path.join(__dirname, "../templates");

// ==========================
// 1️⃣ Vérification arguments
// ==========================
const projectName = process.argv[2];

if (!projectName) {
  console.error("❌ Erreur : Vous devez fournir un nom de projet.");
  console.error("👉 Exemple : npx create-express-project api-test");
  process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

// ==========================
// 2️⃣ Questions interactives
// ==========================
const ask = await inquirer.prompt([
  {
    type: "confirm",
    name: "prisma",
    message: "Voulez-vous installer Prisma ?",
    default: true,
  },
  {
    type: "confirm",
    name: "zod",
    message: "Voulez-vous installer Zod ?",
    default: true,
  },
  {
    type: "confirm",
    name: "swagger",
    message: "Voulez-vous installer Swagger Documentation ?",
    default: true,
  },
  {
    type: "confirm",
    name: "defaultModule",
    message: "Voulez-vous générer le module User par défaut ?",
    default: true,
  },
]);

// ==========================
// 3️⃣ Helpers
// ==========================
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function updatePackageJson(projectPath, projectName) {
  const pkgPath = path.join(projectPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    let content = fs.readFileSync(pkgPath, "utf-8");
    content = content.replace("{{PROJECT_NAME}}", projectName);
    fs.writeFileSync(pkgPath, content);
  }
}

function removeSwaggerFromApp(projectPath) {
  const appPath = path.join(projectPath, "src/app.ts");
  if (fs.existsSync(appPath)) {
    let content = fs.readFileSync(appPath, "utf-8");

    // Supprimer l'import Swagger
    content = content.replace(
      /\/\/ @swagger-import\n.*\n\/\/ @end-swagger-import\n/s,
      ""
    );

    // Supprimer le setup Swagger
    content = content.replace(
      /\n\s*\/\/ @swagger-setup\n.*\n\s*\/\/ @end-swagger-setup/s,
      ""
    );

    fs.writeFileSync(appPath, content);
  }
}

// ==========================
// 4️⃣ Création du projet
// ==========================
console.log(`📁 Création du projet : ${projectName} ...`);
fs.mkdirSync(projectPath, { recursive: true });

// 5️⃣ Copier le template entier
console.log("📂 Copie du template...");
copyRecursive(templatesDir, projectPath);

// ==========================
// 6️⃣ Supprimer options non voulues
// ==========================

// ❌ Enlever Prisma si non choisi
if (!ask.prisma) {
  fs.rmSync(path.join(projectPath, "prisma"), { recursive: true, force: true });
  fs.rmSync(path.join(projectPath, "src/infrastructre/prisma"), { recursive: true, force: true });
}

// ❌ Enlever Swagger si non choisi
if (!ask.swagger) {
  const swaggerPath = path.join(projectPath, "src/core/swagger");
  if (fs.existsSync(swaggerPath)) {
    fs.rmSync(swaggerPath, { recursive: true, force: true });
  }
  // Nettoyer les imports et setup dans app.ts
  removeSwaggerFromApp(projectPath);
}

// ❌ Enlever module User si non choisi
if (!ask.defaultModule) {
  const userPath = path.join(projectPath, "src/modules/user");
  if (fs.existsSync(userPath)) {
    fs.rmSync(userPath, { recursive: true, force: true });
  }
}

// ==========================
// 7️⃣ Mise à jour du package.json
// ==========================
console.log("📦 Configuration du package.json...");
updatePackageJson(projectPath, projectName);

// ==========================
// 8️⃣ Installer les dépendances
// ==========================
console.log("📦 Installation des dépendances...");

const deps = ["express", "cors", "helmet", "dotenv"];
const devDeps = ["typescript", "ts-node", "nodemon", "@types/node", "@types/express", "@types/cors", "@types/helmet"];

if (ask.prisma) {
  deps.push("@prisma/client");
  devDeps.push("prisma");
}

if (ask.swagger) {
  deps.push("swagger-ui-express", "swagger-jsdoc");
  devDeps.push("@types/swagger-ui-express", "@types/swagger-jsdoc");
}

if (ask.zod) {
  deps.push("zod");
}

execSync(`npm install ${deps.join(" ")}`, { cwd: projectPath, stdio: "inherit" });
execSync(`npm install -D ${devDeps.join(" ")}`, { cwd: projectPath, stdio: "inherit" });

// ==========================
// 9️⃣ Fin
// ==========================
console.log("\n✅ Projet créé avec succès !");
console.log(`👉 cd ${projectName}`);
if (ask.prisma) console.log("👉 npx prisma generate");
console.log("👉 npm run dev\n");
if (ask.swagger) {
  console.log("📚 Documentation Swagger disponible sur: http://localhost:8000/api-docs");
}
console.log("🚀 Bon développement !");
