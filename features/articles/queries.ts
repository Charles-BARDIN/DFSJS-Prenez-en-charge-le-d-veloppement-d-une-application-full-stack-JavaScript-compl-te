import { prisma } from "@/lib/prisma";

/** Ordre de tri chronologique du fil d'actualité. */
export type FeedOrder = "desc" | "asc";

/**
 * Fil d'actualité d'un utilisateur : articles des thèmes auxquels il est abonné,
 * triés par date de création (du plus récent au plus ancien par défaut).
 */
export const getFeed = (userId: string, order: FeedOrder = "desc") => {
  return prisma.article.findMany({
    where: {
      topic: { subscriptions: { some: { userId } } },
    },
    orderBy: { createdAt: order },
    include: {
      author: { select: { username: true } },
      topic: { select: { title: true } },
    },
  });
};

/** Détail d'un article avec son thème, son auteur et ses commentaires. */
export const getArticle = (articleId: string) => {
  return prisma.article.findUnique({
    where: { id: articleId },
    include: {
      author: { select: { username: true } },
      topic: { select: { title: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { username: true } } },
      },
    },
  });
};
