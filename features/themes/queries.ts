import { prisma } from "@/lib/prisma";

/** Récupère la liste de tous les thèmes, triés par titre. */
export const getTopics = () => {
  return prisma.topic.findMany({
    orderBy: { title: "asc" },
  });
};
