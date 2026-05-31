import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Retourne l'utilisateur courant à partir de la session Auth.js, ou `null` s'il
 * n'est pas connecté. Mémoïsé par requête (`cache`) pour éviter plusieurs
 * lectures de session/BDD au sein d'un même rendu.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({ where: { id: session.user.id } });
});

/**
 * Garantit un utilisateur connecté : retourne l'utilisateur courant ou redirige
 * vers la page de connexion. À utiliser dans les pages protégées (Server
 * Components) où l'utilisateur est nécessairement présent.
 */
export const requireUser = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
};
