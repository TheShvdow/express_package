#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, "../templates");
const templatesAuthDir = path.join(__dirname, "../templates-auth");

// ─── ANSI colors (zero deps) ──────────────────────────────────────────────────
const c = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  cyan:   "\x1b[36m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  blue:   "\x1b[34m",
  magenta:"\x1b[35m",
  white:  "\x1b[37m",
  gray:   "\x1b[90m",
};

const fmt = {
  step:    (s) => `${c.cyan}${c.bold}  ◆${c.reset}  ${s}`,
  success: (s) => `${c.green}${c.bold}  ✔${c.reset}  ${s}`,
  warn:    (s) => `${c.yellow}${c.bold}  ⚠${c.reset}  ${s}`,
  error:   (s) => `${c.red}${c.bold}  ✖${c.reset}  ${s}`,
  info:    (s) => `${c.gray}     ${s}${c.reset}`,
  code:    (s) => `${c.gray}  $${c.reset}  ${c.cyan}${s}${c.reset}`,
  label:   (s) => `${c.bold}${c.white}${s}${c.reset}`,
  tag:     (s) => `${c.magenta}${c.bold}${s}${c.reset}`,
  dim:     (s) => `${c.gray}${s}${c.reset}`,
  divider: ()  => `${c.gray}  ${"─".repeat(50)}${c.reset}`,
};

function print(...args) { console.log(...args); }

function banner() {
  print();
  print(`${c.cyan}${c.bold}   ╔═══════════════════════════════════════╗${c.reset}`);
  print(`${c.cyan}${c.bold}   ║${c.reset}  ${c.bold}${c.white}create-express-app${c.reset}  ${c.gray}by TheShvdow${c.reset}   ${c.cyan}${c.bold}║${c.reset}`);
  print(`${c.cyan}${c.bold}   ╚═══════════════════════════════════════╝${c.reset}`);
  print(fmt.dim("   Express · TypeScript · Clean Architecture"));
  print();
}

function spinner(message) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${c.cyan}  ${frames[i++ % frames.length]}${c.reset}  ${message}`);
  }, 80);
  return {
    succeed(msg) {
      clearInterval(interval);
      process.stdout.write(`\r${fmt.success(msg || message)}\n`);
    },
    fail(msg) {
      clearInterval(interval);
      process.stdout.write(`\r${fmt.error(msg || message)}\n`);
    },
  };
}

// ─── Package manager config ───────────────────────────────────────────────────
const PM = {
  npm:  { install: "npm install",  installDev: "npm install -D",  run: "npm run dev",  init: "npm init -y" },
  yarn: { install: "yarn add",     installDev: "yarn add -D",     run: "yarn dev",     init: "yarn init -y" },
  pnpm: { install: "pnpm add",     installDev: "pnpm add -D",     run: "pnpm dev",     init: "pnpm init" },
  bun:  { install: "bun add",      installDev: "bun add -d",      run: "bun dev",      init: "bun init -y" },
};

// ─── Package map ──────────────────────────────────────────────────────────────
const PACKAGES = {
  base: {
    deps: ["express", "cors", "helmet", "dotenv", "pino"],
    devDeps: {
      common: ["typescript", "@types/node", "@types/express", "@types/cors", "@types/helmet", "pino-pretty"],
      // bun a son propre runtime — pas besoin de ts-node/nodemon
      node:   ["ts-node", "nodemon"],
    },
  },
  prisma: {
    deps: ["@prisma/client@7", "@prisma/adapter-pg", "pg"],
    devDeps: ["prisma@7", "@types/pg"],
  },
  swagger: {
    deps: ["swagger-ui-express", "swagger-jsdoc"],
    devDeps: ["@types/swagger-ui-express", "@types/swagger-jsdoc"],
  },
  zod: {
    deps: ["zod"],
    devDeps: [],
  },
  auth: {
    deps: ["jsonwebtoken", "bcrypt"],
    devDeps: ["@types/jsonwebtoken", "@types/bcrypt"],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateProjectName(name) {
  if (/\s/.test(name))
    return "Le nom ne doit pas contenir d'espaces. Utilisez des tirets (ex: my-api).";
  if (/[^a-zA-Z0-9._-]/.test(name))
    return "Caractères invalides. Utilisez uniquement lettres, chiffres, tirets, underscores ou points.";
  if (name.startsWith(".") || name.startsWith("-"))
    return "Le nom ne doit pas commencer par un point ou un tiret.";
  if (name.length > 214)
    return "Le nom est trop long (max 214 caractères).";
  return null;
}

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

function updatePackageJson(projectPath, projectName, pm) {
  const pkgPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(pkgPath)) return;
  const devScript =
    pm === "bun"
      ? "bun --watch src/server.ts"
      : "nodemon --exec ts-node src/server.ts";
  let content = fs.readFileSync(pkgPath, "utf-8");
  content = content.replace("{{PROJECT_NAME}}", projectName);
  content = content.replace("{{DEV_SCRIPT}}", devScript);
  fs.writeFileSync(pkgPath, content, "utf-8");
}

function removeSwaggerFromApp(projectPath) {
  const appPath = path.join(projectPath, "src/app.ts");
  if (!fs.existsSync(appPath)) return;

  let content = fs.readFileSync(appPath, "utf-8").replace(/\r\n/g, "\n");
  const importPattern = /\/\/ @swagger-import\n[\s\S]*?\/\/ @end-swagger-import\n/;
  const setupPattern  = /\n\s*\/\/ @swagger-setup\n[\s\S]*?\/\/ @end-swagger-setup/;

  content = content.replace(importPattern, "");
  content = content.replace(setupPattern, "");
  fs.writeFileSync(appPath, content, "utf-8");
}

function generateEnvExample(projectPath, options) {
  const lines = [
    "# Variables d'environnement — copiez ce fichier en .env et remplissez les valeurs",
    "",
    "NODE_ENV=development",
    "PORT=8000",
    "ALLOWED_ORIGINS=http://localhost:3000",
  ];
  if (options.prisma) {
    lines.push("", "# Prisma / Base de données");
    lines.push('DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"');
  }
  if (options.auth) {
    lines.push("", "# JWT");
    lines.push("JWT_SECRET=change-me-in-production");
  }
  fs.writeFileSync(path.join(projectPath, ".env.example"), lines.join("\n") + "\n", "utf-8");
}

function generateGitignore(projectPath) {
  const content = ["node_modules/", "dist/", "src/generated/", ".env", "*.log", ".DS_Store"].join("\n") + "\n";
  fs.writeFileSync(path.join(projectPath, ".gitignore"), content, "utf-8");
}

function generateDockerCompose(projectPath) {
  const src = path.join(templatesDir, "docker-compose.yml");
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(projectPath, "docker-compose.yml"));
  }
}

function runOrCleanup(command, execOptions, projectPath, projectName) {
  try {
    execSync(command, execOptions);
  } catch {
    print(fmt.error(`Échec : ${command}`));
    print(fmt.warn("Nettoyage du projet partiellement créé..."));
    if (fs.existsSync(projectPath)) fs.rmSync(projectPath, { recursive: true, force: true });
    print();
    print(fmt.info(`Réessayez manuellement : cd ${projectName} && npm install`));
    process.exit(1);
  }
}

// ─── Summary box ──────────────────────────────────────────────────────────────

function printSummary(projectName, projectType, ask) {
  const badges = [];
  if (ask.prisma)  badges.push(`${c.blue}Prisma${c.reset}`);
  if (ask.zod)     badges.push(`${c.green}Zod${c.reset}`);
  if (ask.swagger) badges.push(`${c.yellow}Swagger${c.reset}`);
  if (ask.auth)    badges.push(`${c.magenta}JWT Auth${c.reset}`);

  print();
  print(fmt.divider());
  print(`${c.gray}  Récapitulatif${c.reset}`);
  print(fmt.divider());
  print(fmt.info(`Projet       ${c.bold}${c.white}${projectName}${c.reset}`));
  print(fmt.info(`Mode         ${projectType === "auth" ? fmt.tag("Starter Kit Auth") : `${c.cyan}${c.bold}Minimal${c.reset}`}`));
  print(fmt.info(`Package mgr  ${c.bold}${ask.packageManager}${c.reset}`));
  if (badges.length > 0) {
    print(fmt.info(`Inclus       ${badges.join("  ")}`));
  }
  print(fmt.divider());
  print();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  banner();

  // 1️⃣ Nom du projet
  let projectName = process.argv[2];

  if (projectName) {
    const nameError = validateProjectName(projectName);
    if (nameError) {
      print(fmt.error(nameError));
      process.exit(1);
    }
  } else {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Nom du projet :",
        default: "my-api",
        validate: (v) => validateProjectName(v.trim()) ?? true,
        filter: (v) => v.trim(),
      },
    ]);
    projectName = name;
  }

  // 2️⃣ Vérification templates
  if (!fs.existsSync(templatesDir)) {
    print(fmt.error(`Dossier de templates introuvable : "${templatesDir}"`));
    print(fmt.info("Le package est peut-être corrompu. Réinstallez-le."));
    process.exit(1);
  }

  // 3️⃣ Vérification que le répertoire n'existe pas
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    print(fmt.error(`Le répertoire "${projectName}" existe déjà.`));
    print(fmt.info("Choisissez un autre nom ou supprimez le répertoire existant."));
    process.exit(1);
  }

  // 4️⃣ Type de projet
  print(fmt.divider());
  print();
  const { projectType } = await inquirer.prompt([
    {
      type: "list",
      name: "projectType",
      message: "Type de projet :",
      choices: [
        {
          name: `${c.cyan}${c.bold}Minimal${c.reset}          Express + TS, options au choix`,
          value: "minimal",
        },
        {
          name: `${c.magenta}${c.bold}Starter Kit Auth${c.reset}  JWT complet (register / login / /me)`,
          value: "auth",
        },
      ],
    },
  ]);

  // 5️⃣ Options selon le mode
  let ask;

  if (projectType === "auth") {
    print();
    print(fmt.info(`${c.magenta}${c.bold}Starter Kit Auth${c.reset} inclut automatiquement : Prisma · Zod · Swagger · JWT`));
    print();

    const { packageManager } = await inquirer.prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Gestionnaire de paquets :",
        choices: [
          { name: `${c.bold}npm${c.reset}`, value: "npm" },
          { name: `${c.bold}yarn${c.reset}`, value: "yarn" },
          { name: `${c.bold}pnpm${c.reset}  ${c.gray}(rapide)${c.reset}`, value: "pnpm" },
          { name: `${c.bold}bun${c.reset}   ${c.gray}(le plus rapide, runtime alternatif)${c.reset}`, value: "bun" },
        ],
        default: "npm",
      },
    ]);
    ask = { packageManager, prisma: true, zod: true, swagger: true, auth: true };

  } else {
    print();
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Gestionnaire de paquets :",
        choices: [
          { name: `${c.bold}npm${c.reset}`, value: "npm" },
          { name: `${c.bold}yarn${c.reset}`, value: "yarn" },
          { name: `${c.bold}pnpm${c.reset}  ${c.gray}(rapide)${c.reset}`, value: "pnpm" },
          { name: `${c.bold}bun${c.reset}   ${c.gray}(le plus rapide, runtime alternatif)${c.reset}`, value: "bun" },
        ],
        default: "npm",
      },
      {
        type: "confirm",
        name: "prisma",
        message: `Inclure ${c.blue}${c.bold}Prisma${c.reset} ?  ${c.gray}ORM PostgreSQL + migrations${c.reset}`,
        default: true,
      },
      {
        type: "confirm",
        name: "zod",
        message: `Inclure ${c.green}${c.bold}Zod${c.reset} ?     ${c.gray}Validation des données en runtime${c.reset}`,
        default: true,
      },
      {
        type: "confirm",
        name: "swagger",
        message: `Inclure ${c.yellow}${c.bold}Swagger${c.reset} ?  ${c.gray}Docs OpenAPI auto-générées sur /api-docs${c.reset}`,
        default: true,
      },
    ]);
    ask = { ...answers, auth: false };
  }

  // Récapitulatif avant de commencer
  printSummary(projectName, projectType, ask);

  // 6️⃣ Confirmation
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: "Créer le projet ?",
      default: true,
    },
  ]);

  if (!confirmed) {
    print();
    print(fmt.warn("Annulé. Aucun fichier créé."));
    print();
    process.exit(0);
  }

  print();

  // Commandes selon le package manager
  const pm = ask.packageManager;
  const { install: installCmd, installDev: installDevCmd, run: devRunCmd } = PM[pm];

  try {
    // 7️⃣ Création du dossier
    let spin = spinner(`Création du projet ${c.bold}${projectName}${c.reset}...`);
    fs.mkdirSync(projectPath, { recursive: true });
    copyRecursive(templatesDir, projectPath);
    spin.succeed(`Dossier ${c.bold}${projectName}/${c.reset} créé`);

    // 8️⃣ Overlay auth
    if (projectType === "auth") {
      if (!fs.existsSync(templatesAuthDir)) {
        print(fmt.error(`Dossier templates-auth introuvable : "${templatesAuthDir}"`));
        process.exit(1);
      }
      spin = spinner("Ajout des fichiers d'authentification...");
      copyRecursive(templatesAuthDir, projectPath);
      spin.succeed("Fichiers auth copiés");
    }

    // 9️⃣ Retrait des options non choisies
    if (!ask.prisma) {
      for (const p of [
        path.join(projectPath, "prisma"),
        path.join(projectPath, "prisma.config.ts"),
        path.join(projectPath, "src/infrastructure/prisma"),
      ]) {
        if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
      }
    }

    if (!ask.zod) {
      const validatorPath = path.join(projectPath, "src/infrastructure/http/middleware/validator.ts");
      if (fs.existsSync(validatorPath)) fs.rmSync(validatorPath);
    }

    if (!ask.swagger) {
      const swaggerPath = path.join(projectPath, "src/core/swagger");
      if (fs.existsSync(swaggerPath)) fs.rmSync(swaggerPath, { recursive: true, force: true });
      removeSwaggerFromApp(projectPath);
    }

    // 🔟 Config
    spin = spinner("Configuration du projet...");
    updatePackageJson(projectPath, projectName, pm);
    generateEnvExample(projectPath, ask);
    generateGitignore(projectPath);
    if (ask.prisma) generateDockerCompose(projectPath);
    spin.succeed("package.json · .env.example · .gitignore configurés");

    // 1️⃣1️⃣ Dépendances
    const deps    = [...PACKAGES.base.deps];
    // bun exécute TypeScript nativement — ts-node et nodemon ne sont pas nécessaires
    const devDeps = [
      ...PACKAGES.base.devDeps.common,
      ...(pm === "bun" ? [] : PACKAGES.base.devDeps.node),
    ];
    if (ask.prisma)  { deps.push(...PACKAGES.prisma.deps);   devDeps.push(...PACKAGES.prisma.devDeps); }
    if (ask.swagger) { deps.push(...PACKAGES.swagger.deps);  devDeps.push(...PACKAGES.swagger.devDeps); }
    if (ask.zod)       deps.push(...PACKAGES.zod.deps);
    if (ask.auth)    { deps.push(...PACKAGES.auth.deps);     devDeps.push(...PACKAGES.auth.devDeps); }

    print(fmt.step(`Installation des dépendances via ${c.bold}${pm}${c.reset}...`));
    print();
    runOrCleanup(`${installCmd} ${deps.join(" ")}`,         { cwd: projectPath, stdio: "inherit" }, projectPath, projectName);
    runOrCleanup(`${installDevCmd} ${devDeps.join(" ")}`,   { cwd: projectPath, stdio: "inherit" }, projectPath, projectName);
    print();

    // 1️⃣2️⃣ Succès
    print(fmt.divider());
    print();
    print(`${c.green}${c.bold}  ✔  Projet "${projectName}" prêt !${c.reset}`);
    print();
    print(`${c.bold}  Prochaines étapes :${c.reset}`);
    print();
    print(fmt.code(`cd ${projectName}`));

    // Commande prisma selon le pm (bun utilise bunx, sinon npx)
    const px = pm === "bun" ? "bunx" : pm === "pnpm" ? "pnpm dlx" : pm === "yarn" ? "yarn dlx" : "npx";

    if (projectType === "auth") {
      print(fmt.code("cp .env.example .env"));
      print(fmt.info(`   ${c.gray}→ renseigner JWT_SECRET (DATABASE_URL déjà configurée pour docker-compose)${c.reset}`));
      print(fmt.code("docker compose up -d"));
      print(fmt.code(`${px} prisma generate`));
      print(fmt.code(`${px} prisma migrate dev --name init`));
      print(fmt.code(devRunCmd));
      print();
      print(`  ${c.magenta}${c.bold}Endpoints auth :${c.reset}`);
      print(fmt.info(`${c.bold}POST${c.reset}  /api/auth/register`));
      print(fmt.info(`${c.bold}POST${c.reset}  /api/auth/login`));
      print(fmt.info(`${c.bold}GET${c.reset}   /api/auth/me  ${c.gray}(Authorization: Bearer <token>)${c.reset}`));
    } else {
      if (ask.prisma) {
        print(fmt.code("cp .env.example .env"));
        print(fmt.info(`   ${c.gray}→ DATABASE_URL déjà configurée pour docker-compose${c.reset}`));
        print(fmt.code("docker compose up -d"));
        print(fmt.code(`${px} prisma generate`));
      }
      print(fmt.code(devRunCmd));
    }

    if (ask.swagger) {
      print();
      print(fmt.info(`${c.yellow}Swagger UI${c.reset} disponible sur ${c.bold}http://localhost:8000/api-docs${c.reset}`));
    }

    print();
    print(fmt.divider());
    print(`${c.gray}  Bon développement ! 🚀${c.reset}`);
    print();

  } catch (err) {
    print(fmt.error(`Erreur inattendue : ${err.message || err}`));
    if (fs.existsSync(projectPath)) {
      print(fmt.warn("Nettoyage..."));
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(fmt.error(`Erreur fatale : ${err.message || err}`));
  process.exit(1);
});
