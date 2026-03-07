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

const VERSION = "1.1.4";

// ─── ANSI colors ──────────────────────────────────────────────────────────────
const c = {
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
  dim:     "\x1b[2m",
  cyan:    "\x1b[36m",
  green:   "\x1b[32m",
  yellow:  "\x1b[33m",
  red:     "\x1b[31m",
  blue:    "\x1b[34m",
  magenta: "\x1b[35m",
  white:   "\x1b[37m",
  gray:    "\x1b[90m",
  // Bright variants
  bcyan:   "\x1b[96m",
  bgreen:  "\x1b[92m",
  bblue:   "\x1b[94m",
  bwhite:  "\x1b[97m",
};

// Simulated gradient: each line of the ASCII art gets a slightly different shade
const GRADIENT = [c.bblue, c.bcyan, c.bcyan, c.cyan, c.cyan, c.blue];

function print(...args) { console.log(...args); }

// ─── Banner ───────────────────────────────────────────────────────────────────
function banner() {
  const art = [
    "  ███████╗██╗███╗   ███╗██████╗ ██╗  ██╗   ██╗",
    "  ██╔════╝██║████╗ ████║██╔══██╗██║  ╚██╗ ██╔╝",
    "  ███████╗██║██╔████╔██║██████╔╝██║   ╚████╔╝ ",
    "  ╚════██║██║██║╚██╔╝██║██╔═══╝ ██║    ╚██╔╝  ",
    "  ███████║██║██║ ╚═╝ ██║██║     ███████╗██║   ",
    "  ╚══════╝╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝   ",
  ];
  print();
  art.forEach((line, i) => {
    print(`${GRADIENT[i] || c.cyan}${c.bold}${line}${c.reset}`);
  });
  print(`${c.bcyan}${c.bold}             ✦  E X P R E S S  ✦${c.reset}`);
  print();
  print(`${c.gray}  v${VERSION}  ·  Express · TypeScript · Clean Architecture${c.reset}`);
  print(`${c.gray}  by ${c.cyan}TheShvdow${c.gray}  ·  github.com/TheShvdow/express_package${c.reset}`);
  print();
}

// ─── Section header ───────────────────────────────────────────────────────────
function sectionHeader(title) {
  const width = 44;
  const bar = "─".repeat(width);
  print(`${c.cyan}  ┌${bar}┐${c.reset}`);
  print(`${c.cyan}  │${c.reset}  ${c.bold}${c.bwhite}${title}${c.reset}${" ".repeat(Math.max(0, width - title.length - 1))}${c.cyan}│${c.reset}`);
  print(`${c.cyan}  └${bar}┘${c.reset}`);
  print();
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function spinner(message) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(
      `\r  ${c.bcyan}${frames[i++ % frames.length]}${c.reset}  ${c.bold}${message}${c.reset}${c.gray}...${c.reset}`
    );
  }, 80);
  return {
    succeed(msg) {
      clearInterval(interval);
      process.stdout.write(
        `\r  ${c.bgreen}✔${c.reset}  ${c.bold}${msg || message}${c.reset}` + " ".repeat(10) + "\n"
      );
    },
    fail(msg) {
      clearInterval(interval);
      process.stdout.write(
        `\r  ${c.red}✖${c.reset}  ${c.bold}${msg || message}${c.reset}` + " ".repeat(10) + "\n"
      );
    },
  };
}

// ─── fmt helpers ──────────────────────────────────────────────────────────────
const fmt = {
  step:    (s) => `  ${c.bcyan}◆${c.reset}  ${s}`,
  success: (s) => `  ${c.bgreen}✔${c.reset}  ${s}`,
  warn:    (s) => `  ${c.yellow}⚠${c.reset}  ${s}`,
  error:   (s) => `  ${c.red}✖${c.reset}  ${s}`,
  info:    (s) => `${c.gray}     ${s}${c.reset}`,
  code:    (s) => `  ${c.gray}$${c.reset}  ${c.bcyan}${s}${c.reset}`,
  dim:     (s) => `${c.gray}${s}${c.reset}`,
  divider: ()  => `${c.gray}  ${"─".repeat(46)}${c.reset}`,
  tag:     (s) => `${c.magenta}${c.bold}${s}${c.reset}`,
};

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
      : "nodemon --exec 'ts-node --transpile-only' src/server.ts";
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;
  pkg.scripts.dev = devScript;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
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
    "ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000",
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
  const width = 44;
  const pad = (label, value) => {
    const line = `  ${c.gray}${label.padEnd(10)}${c.reset}${c.cyan}›${c.reset}  ${value}`;
    return line;
  };

  const plugins = [];
  if (ask.prisma)  plugins.push(`${c.blue}${c.bold}Prisma${c.reset}`);
  if (ask.zod)     plugins.push(`${c.green}${c.bold}Zod${c.reset}`);
  if (ask.swagger) plugins.push(`${c.yellow}${c.bold}Swagger${c.reset}`);
  if (ask.auth)    plugins.push(`${c.magenta}${c.bold}JWT Auth${c.reset}`);

  const modeLabel = projectType === "auth"
    ? `${c.magenta}${c.bold}Starter Kit Auth${c.reset}`
    : `${c.bcyan}${c.bold}Minimal${c.reset}`;

  print();
  print(`  ${c.cyan}╭${"─".repeat(width)}╮${c.reset}`);
  print(`  ${c.cyan}│${c.reset}  ${c.bold}${c.bwhite}📦  ${projectName}${c.reset}${" ".repeat(Math.max(0, width - projectName.length - 4))}${c.cyan}│${c.reset}`);
  print(`  ${c.cyan}│${c.reset}  ${c.gray}${"─".repeat(width - 2)}${c.reset}  ${c.cyan}│${c.reset}`);
  print(`  ${c.cyan}│${c.reset}${pad("Mode", modeLabel)}${" ".repeat(Math.max(0, width - 24))}${c.cyan}│${c.reset}`);
  print(`  ${c.cyan}│${c.reset}${pad("PM", `${c.bold}${ask.packageManager}${c.reset}`)}${" ".repeat(Math.max(0, width - 10 - ask.packageManager.length))}${c.cyan}│${c.reset}`);
  if (plugins.length > 0) {
    print(`  ${c.cyan}│${c.reset}${pad("Plugins", plugins.join("  "))}${" ".repeat(Math.max(0, width - 10 - plugins.length * 8))}${c.cyan}│${c.reset}`);
  }
  print(`  ${c.cyan}╰${"─".repeat(width)}╯${c.reset}`);
  print();
}

// ─── Success screen ───────────────────────────────────────────────────────────
function printSuccess(projectName, projectType, ask, pm) {
  const px = pm === "bun" ? "bunx" : pm === "pnpm" ? "pnpm dlx" : pm === "yarn" ? "yarn dlx" : "npx";
  const { run: devRunCmd } = PM[pm];

  const title = "  ✦  Your project is ready!";
  const width = 44;

  print();
  print(`  ${c.bgreen}╔${"═".repeat(width)}╗${c.reset}`);
  print(`  ${c.bgreen}║${c.reset}${c.bold}${c.bwhite}${title}${" ".repeat(width - title.length + 2)}${c.bgreen}║${c.reset}`);
  print(`  ${c.bgreen}╚${"═".repeat(width)}╝${c.reset}`);
  print();
  print(`  ${c.bold}${c.bwhite}Next steps:${c.reset}`);
  print();
  print(fmt.code(`cd ${projectName}`));

  if (projectType === "auth") {
    print(fmt.code("cp .env.example .env"));
    print(fmt.info(`   ${c.gray}→ renseigner JWT_SECRET dans .env${c.reset}`));
    print(fmt.code("docker compose up -d"));
    print(fmt.code(`${px} prisma migrate dev --name init`));
    print(fmt.code(devRunCmd));
    print();
    print(`  ${c.magenta}${c.bold}Auth endpoints :${c.reset}`);
    print(`  ${c.gray}POST${c.reset}  ${c.white}/api/auth/register${c.reset}`);
    print(`  ${c.gray}POST${c.reset}  ${c.white}/api/auth/login${c.reset}`);
    print(`  ${c.gray}GET ${c.reset}  ${c.white}/api/auth/me${c.reset}  ${c.gray}(Authorization: Bearer <token>)${c.reset}`);
  } else {
    if (ask.prisma) {
      print(fmt.code("cp .env.example .env"));
      print(fmt.info(`   ${c.gray}→ DATABASE_URL déjà configurée pour docker-compose${c.reset}`));
      print(fmt.code("docker compose up -d"));
      print(fmt.code(`${px} prisma migrate dev --name init`));
    }
    print(fmt.code(devRunCmd));
  }

  if (ask.swagger) {
    print();
    print(`  ${c.yellow}◆${c.reset}  Swagger UI  ${c.gray}→${c.reset}  ${c.bold}http://localhost:8000/api-docs${c.reset}`);
  }

  print();
  print(`  ${c.gray}${"─".repeat(46)}${c.reset}`);
  print(`  ${c.gray}Happy coding!  ${c.cyan}✦${c.reset}`);
  print();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  banner();

  // 1. Nom du projet
  let projectName = process.argv[2];

  if (projectName) {
    const nameError = validateProjectName(projectName);
    if (nameError) {
      print(fmt.error(nameError));
      process.exit(1);
    }
  } else {
    sectionHeader("◆  Project name");
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is your project name?",
        default: "my-api",
        validate: (v) => validateProjectName(v.trim()) ?? true,
        filter: (v) => v.trim(),
      },
    ]);
    projectName = name;
  }

  // 2. Vérification templates
  if (!fs.existsSync(templatesDir)) {
    print(fmt.error(`Templates directory not found: "${templatesDir}"`));
    print(fmt.info("The package may be corrupted. Please reinstall it."));
    process.exit(1);
  }

  // 3. Vérification que le répertoire n'existe pas
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    print(fmt.error(`Directory "${projectName}" already exists.`));
    print(fmt.info("Choose another name or delete the existing directory."));
    process.exit(1);
  }

  // 4. Type de projet
  print();
  sectionHeader("◆  Project type");
  const { projectType } = await inquirer.prompt([
    {
      type: "list",
      name: "projectType",
      message: "Which template do you want?",
      choices: [
        {
          name: `${c.bcyan}${c.bold}Minimal${c.reset}          ${c.gray}Express + TS, pick your options${c.reset}`,
          value: "minimal",
        },
        {
          name: `${c.magenta}${c.bold}Starter Kit Auth${c.reset}  ${c.gray}JWT complete (register / login / me)${c.reset}`,
          value: "auth",
        },
      ],
    },
  ]);

  // 5. Options
  let ask;

  if (projectType === "auth") {
    print();
    print(`  ${c.magenta}${c.bold}Starter Kit Auth${c.reset} includes: ${c.blue}Prisma${c.reset}  ${c.green}Zod${c.reset}  ${c.yellow}Swagger${c.reset}  ${c.magenta}JWT${c.reset}`);
    print();
    sectionHeader("◆  Package manager");

    const { packageManager } = await inquirer.prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager?",
        choices: [
          { name: `${c.bold}npm${c.reset}`, value: "npm" },
          { name: `${c.bold}yarn${c.reset}`, value: "yarn" },
          { name: `${c.bold}pnpm${c.reset}   ${c.gray}fast${c.reset}`, value: "pnpm" },
          { name: `${c.bold}bun${c.reset}    ${c.gray}fastest · native TS runtime${c.reset}`, value: "bun" },
        ],
        default: "npm",
      },
    ]);
    ask = { packageManager, prisma: true, zod: true, swagger: true, auth: true };

  } else {
    print();
    sectionHeader("◆  Package manager & options");
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager?",
        choices: [
          { name: `${c.bold}npm${c.reset}`, value: "npm" },
          { name: `${c.bold}yarn${c.reset}`, value: "yarn" },
          { name: `${c.bold}pnpm${c.reset}   ${c.gray}fast${c.reset}`, value: "pnpm" },
          { name: `${c.bold}bun${c.reset}    ${c.gray}fastest · native TS runtime${c.reset}`, value: "bun" },
        ],
        default: "npm",
      },
      {
        type: "confirm",
        name: "prisma",
        message: `Include ${c.blue}${c.bold}Prisma${c.reset}?   ${c.gray}PostgreSQL ORM + migrations${c.reset}`,
        default: true,
      },
      {
        type: "confirm",
        name: "zod",
        message: `Include ${c.green}${c.bold}Zod${c.reset}?     ${c.gray}Runtime data validation${c.reset}`,
        default: true,
      },
      {
        type: "confirm",
        name: "swagger",
        message: `Include ${c.yellow}${c.bold}Swagger${c.reset}?  ${c.gray}OpenAPI docs at /api-docs${c.reset}`,
        default: true,
      },
    ]);
    ask = { ...answers, auth: false };
  }

  // Summary + confirmation
  printSummary(projectName, projectType, ask);

  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: "Create project?",
      default: true,
    },
  ]);

  if (!confirmed) {
    print();
    print(fmt.warn("Cancelled. No files were created."));
    print();
    process.exit(0);
  }

  print();
  sectionHeader("◆  Scaffolding");

  const pm = ask.packageManager;
  const { install: installCmd, installDev: installDevCmd } = PM[pm];

  try {
    // Création du dossier + copie template
    let spin = spinner(`Creating ${c.bold}${projectName}${c.reset}`);
    fs.mkdirSync(projectPath, { recursive: true });
    copyRecursive(templatesDir, projectPath);
    spin.succeed(`Project folder ${c.bold}${projectName}/${c.reset} created`);

    // Overlay auth
    if (projectType === "auth") {
      if (!fs.existsSync(templatesAuthDir)) {
        print(fmt.error(`Auth templates not found: "${templatesAuthDir}"`));
        process.exit(1);
      }
      spin = spinner("Applying auth overlay");
      copyRecursive(templatesAuthDir, projectPath);
      spin.succeed("Auth files applied");
    }

    // Retrait des options non choisies
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

    // Config
    spin = spinner("Configuring project");
    updatePackageJson(projectPath, projectName, pm);
    generateEnvExample(projectPath, ask);
    generateGitignore(projectPath);
    if (ask.prisma) generateDockerCompose(projectPath);
    spin.succeed("package.json · .env.example · .gitignore ready");

    // Dépendances
    const deps    = [...PACKAGES.base.deps];
    const devDeps = [
      ...PACKAGES.base.devDeps.common,
      ...(pm === "bun" ? [] : PACKAGES.base.devDeps.node),
    ];
    if (ask.prisma)  { deps.push(...PACKAGES.prisma.deps);   devDeps.push(...PACKAGES.prisma.devDeps); }
    if (ask.swagger) { deps.push(...PACKAGES.swagger.deps);  devDeps.push(...PACKAGES.swagger.devDeps); }
    if (ask.zod)       deps.push(...PACKAGES.zod.deps);
    if (ask.auth)    { deps.push(...PACKAGES.auth.deps);     devDeps.push(...PACKAGES.auth.devDeps); }

    print();
    sectionHeader(`◆  Installing dependencies via ${pm}`);
    print();
    runOrCleanup(`${installCmd} ${deps.join(" ")}`,       { cwd: projectPath, stdio: "inherit" }, projectPath, projectName);
    runOrCleanup(`${installDevCmd} ${devDeps.join(" ")}`, { cwd: projectPath, stdio: "inherit" }, projectPath, projectName);
    print();

    // Success
    printSuccess(projectName, projectType, ask, pm);

  } catch (err) {
    print(fmt.error(`Unexpected error: ${err.message || err}`));
    if (fs.existsSync(projectPath)) {
      print(fmt.warn("Cleaning up..."));
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(fmt.error(`Fatal error: ${err.message || err}`));
  process.exit(1);
});
