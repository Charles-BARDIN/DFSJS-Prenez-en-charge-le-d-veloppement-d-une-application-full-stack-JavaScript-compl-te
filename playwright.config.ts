import { defineConfig, devices } from "@playwright/test";

import { loadTestEnv } from "./e2e/load-test-env";

// Charge .env.test (base de données de test isolée) avant tout.
loadTestEnv();

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Prépare la base puis démarre l'application sur la base de test.
  webServer: {
    command: `npm run test:e2e:db && next dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "",
      AUTH_URL: BASE_URL,
    },
  },
});
