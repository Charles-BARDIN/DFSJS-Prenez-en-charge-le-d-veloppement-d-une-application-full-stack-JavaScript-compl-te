import { prisma } from "@/lib/prisma";

/**
 * Récupère tous les thèmes triés par titre, en indiquant pour chacun si
 * l'utilisateur donné y est abonné.
 */
export const getTopicsWithSubscription = async (userId: string) => {
  const topics = await prisma.topic.findMany({
    orderBy: { title: "asc" },
    include: {
      subscriptions: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  return topics.map(({ subscriptions, ...topic }) => ({
    ...topic,
    isSubscribed: subscriptions.length > 0,
  }));
};
