import { beforeEach, vi } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

// Remplace le client Prisma réel par un mock profond, pour tester les Server
// Actions sans base de données. À importer en tête des fichiers de test concernés.
vi.mock("@/lib/prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

// Réinitialise le mock avant chaque test pour garantir leur isolation.
beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
