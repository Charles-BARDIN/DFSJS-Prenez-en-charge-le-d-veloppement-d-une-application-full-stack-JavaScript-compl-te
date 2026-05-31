import { prisma } from "@/lib/prisma";

/**
 * Récupère le profil d'un utilisateur (sans le mot de passe) ainsi que la liste
 * des thèmes auxquels il est abonné.
 */
export const getProfile = (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      subscriptions: {
        orderBy: { topic: { title: "asc" } },
        select: {
          topic: { select: { id: true, title: true, description: true } },
        },
      },
    },
  });
};
