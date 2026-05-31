import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";

import { prismaMock } from "@/test/prisma-mock";
import { getCurrentUser } from "@/features/auth/current-user";
import { subscribe, unsubscribe } from "@/features/themes/actions";

// Dépendances hors base mockées : la session (utilisateur courant) et le cache.
// Factory explicite pour ne pas charger le vrai module (qui importe Auth.js).
vi.mock("@/features/auth/current-user", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const mockedGetCurrentUser = vi.mocked(getCurrentUser);

// Utilisateur courant factice réutilisé dans les tests « connecté ».
const currentUser = { id: "user-1" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("subscribe", () => {
  it("crée l'abonnement et retourne un succès", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);

    const result = await subscribe("topic-1");

    expect(result.success).toBe(true);
    expect(prismaMock.subscription.create).toHaveBeenCalledWith({
      data: { userId: "user-1", topicId: "topic-1" },
    });
  });

  it("échoue si l'utilisateur n'est pas connecté", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const result = await subscribe("topic-1");

    expect(result.success).toBe(false);
    expect(prismaMock.subscription.create).not.toHaveBeenCalled();
  });

  it("considère un abonnement déjà existant (P2002) comme un succès", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);
    prismaMock.subscription.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint", {
        code: "P2002",
        clientVersion: "test",
      }),
    );

    const result = await subscribe("topic-1");

    expect(result.success).toBe(true);
  });

  it("retourne une erreur en cas de défaillance inattendue", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);
    prismaMock.subscription.create.mockRejectedValue(new Error("DB down"));

    const result = await subscribe("topic-1");

    expect(result.success).toBe(false);
  });
});

describe("unsubscribe", () => {
  it("supprime l'abonnement et retourne un succès", async () => {
    mockedGetCurrentUser.mockResolvedValue(currentUser as never);

    const result = await unsubscribe("topic-1");

    expect(result.success).toBe(true);
    expect(prismaMock.subscription.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1", topicId: "topic-1" },
    });
  });

  it("échoue si l'utilisateur n'est pas connecté", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const result = await unsubscribe("topic-1");

    expect(result.success).toBe(false);
    expect(prismaMock.subscription.deleteMany).not.toHaveBeenCalled();
  });
});
