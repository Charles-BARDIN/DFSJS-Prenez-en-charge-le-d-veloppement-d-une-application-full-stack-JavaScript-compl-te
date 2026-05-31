import { execSync } from "node:child_process";

import { loadTestEnv } from "./load-test-env";

// Charge .env.test puis réinitialise la base de test : applique le schéma
// Prisma à neuf et insère les données de seed (thèmes + articles de démo).
loadTestEnv();

// Échappatoire : permet de lancer les tests contre une base déjà préparée
// (utile pour enchaîner plusieurs exécutions sans tout réinitialiser).
if (process.env.E2E_SKIP_DB_RESET === "1") {
  console.log("E2E_SKIP_DB_RESET=1 : réinitialisation de la base ignorée.");
} else {
  execSync("prisma migrate reset --force --skip-generate", {
    stdio: "inherit",
    env: process.env,
  });
  console.log("Base de test prête.");
}
