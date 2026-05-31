import { describe, it, expect, beforeEach, vi } from "vitest";

import { prismaMock } from "@/test/prisma-mock";
import { getTopicsWithSubscription } from "@/features/themes/queries";

beforeEach(() => {
  vi.clearAllMocks();
});

// On teste la transformation métier (calcul de `isSubscribed` et nettoyage de la
// donnée), pas la requête Prisma elle-même.
describe("getTopicsWithSubscription", () => {
  it("indique isSubscribed selon la présence d'abonnements", async () => {
    prismaMock.topic.findMany.mockResolvedValue([
      { id: "t1", title: "React", description: "...", subscriptions: [{ id: "s1" }] },
      { id: "t2", title: "Vue", description: "...", subscriptions: [] },
    ] as never);

    const result = await getTopicsWithSubscription("user-1");

    expect(result).toEqual([
      { id: "t1", title: "React", description: "...", isSubscribed: true },
      { id: "t2", title: "Vue", description: "...", isSubscribed: false },
    ]);
  });

  it("ne fait pas fuiter le tableau d'abonnements dans le résultat", async () => {
    prismaMock.topic.findMany.mockResolvedValue([
      { id: "t1", title: "React", description: "...", subscriptions: [] },
    ] as never);

    const [topic] = await getTopicsWithSubscription("user-1");

    expect(topic).not.toHaveProperty("subscriptions");
  });
});
