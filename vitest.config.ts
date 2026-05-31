import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // On mesure la couverture de notre code applicatif uniquement.
      include: ["app/**", "features/**", "lib/**", "auth.ts", "auth.config.ts"],
      // Exclusions : composants générés (shadcn), config et données de test.
      exclude: [
        "components/ui/**",
        "**/*.config.*",
        "prisma/**",
        "**/layout.tsx",
        "app/**/not-found.tsx",
      ],
    },
  },
});
