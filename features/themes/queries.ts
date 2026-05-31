import { prisma } from "@/lib/prisma";

/**
 * Récupère tous les thèmes en indiquant pour chacun si l'utilisateur donné y est
 * abonné. Les thèmes non suivis sont placés en premier (pour favoriser la
 * découverte), puis les thèmes déjà suivis ; l'ordre alphabétique est conservé
 * à l'intérieur de chaque groupe.
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

  return topics
    .map(({ subscriptions, ...topic }) => ({
      ...topic,
      isSubscribed: subscriptions.length > 0,
    }))
    // Tri stable : conserve l'ordre alphabétique (déjà appliqué par la requête)
    // au sein des thèmes non suivis (false) puis suivis (true).
    .sort((a, b) => Number(a.isSubscribed) - Number(b.isSubscribed));
};

/** Liste légère des thèmes (id + titre), pour les sélecteurs de formulaire. */
export const getTopicList = () => {
  return prisma.topic.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });
};
