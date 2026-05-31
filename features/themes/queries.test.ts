import { describe, it, expect, beforeEach, vi } from "vitest";

import { prismaMock } from "@/test/prisma-mock";
import { getTopicsWithSubscription } from "@/features/themes/queries";

beforeEach(() => {
  vi.clearAllMocks();
});

// On teste la transformation métier (calcul de `isSubscribed` et nettoyage de la
// donnée), pas la requête Prisma elle-même.
describe("getTopicsWithSubscription", () => {
  it("indique isSubscribed et place les thèmes non suivis en premier", async () => {
    // La requête renvoie les thèmes par ordre alphabétique (React puis Vue).
    prismaMock.topic.findMany.mockResolvedValue([
      { id: "t1", title: "React", description: "...", subscriptions: [{ id: "s1" }] },
      { id: "t2", title: "Vue", description: "...", subscriptions: [] },
    ] as never);

    const result = await getTopicsWithSubscription("user-1");

    // Vue (non suivi) passe devant React (suivi).
    expect(result).toEqual([
      { id: "t2", title: "Vue", description: "...", isSubscribed: false },
      { id: "t1", title: "React", description: "...", isSubscribed: true },
    ]);
  });

  it("conserve l'ordre alphabétique au sein de chaque groupe", async () => {
    prismaMock.topic.findMany.mockResolvedValue([
      { id: "a", title: "Angular", description: "...", subscriptions: [{ id: "s1" }] },
      { id: "b", title: "Backend", description: "...", subscriptions: [] },
      { id: "c", title: "CSS", description: "...", subscriptions: [{ id: "s2" }] },
      { id: "d", title: "Docker", description: "...", subscriptions: [] },
    ] as never);

    const titles = (await getTopicsWithSubscription("user-1")).map((t) => t.title);

    // Non suivis d'abord (Backend, Docker), puis suivis (Angular, CSS).
    expect(titles).toEqual(["Backend", "Docker", "Angular", "CSS"]);
  });

  it("ne fait pas fuiter le tableau d'abonnements dans le résultat", async () => {
    prismaMock.topic.findMany.mockResolvedValue([
      { id: "t1", title: "React", description: "...", subscriptions: [] },
    ] as never);

    const [topic] = await getTopicsWithSubscription("user-1");

    expect(topic).not.toHaveProperty("subscriptions");
  });
});
