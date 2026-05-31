import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Tests unitaires/d'intégration uniquement (*.test.*). Les tests end-to-end
    // (e2e/*.spec.ts) sont exécutés par Playwright, pas par Vitest.
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Périmètre : la logique métier testable unitairement (Server Actions de
      // mutation, validations, autorisation, transformation des thèmes, helpers).
      include: [
        "features/articles/actions.ts",
        "features/comments/actions.ts",
        "features/profile/actions.ts",
        "features/themes/actions.ts",
        "features/themes/queries.ts",
        "features/auth/authorize.ts",
        "features/articles/format.ts",
        "lib/validations.ts",
        "lib/action-result.ts",
      ],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
    },
  },
});
