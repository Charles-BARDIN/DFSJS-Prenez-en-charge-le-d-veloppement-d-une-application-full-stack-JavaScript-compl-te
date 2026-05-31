import { join } from "node:path";

// Charge explicitement .env.test (base de test isolée, port 5435).
// On n'utilise pas loadEnvConfig de Next : avec dev=false il charge .env
// (la base de DÉVELOPPEMENT), ce qui exposerait les tests à effacer les
// données de dev. process.loadEnvFile (Node 22) cible le fichier voulu.
export const loadTestEnv = () => {
  process.loadEnvFile(join(process.cwd(), ".env.test"));
};
