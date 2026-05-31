import { PrismaClient } from "@prisma/client";

// Réutilise une seule instance du client en développement pour éviter
// d'épuiser les connexions à chaque rechargement à chaud (hot reload).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
