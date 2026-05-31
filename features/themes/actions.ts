"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/current-user";
import { type ActionResult, ok, fail } from "@/lib/action-result";

/** Abonne l'utilisateur courant au thème donné. */
export const subscribe = async (topicId: string): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return fail("Vous devez être connecté.");

  try {
    await prisma.subscription.create({
      data: { userId: user.id, topicId },
    });
  } catch (error) {
    // Abonnement déjà existant (contrainte d'unicité) : considéré comme un succès.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return ok(undefined);
    }
    return fail("Impossible de s'abonner à ce thème.");
  }

  revalidatePath("/themes");
  return ok(undefined);
};

/** Désabonne l'utilisateur courant du thème donné. */
export const unsubscribe = async (topicId: string): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return fail("Vous devez être connecté.");

  await prisma.subscription.deleteMany({
    where: { userId: user.id, topicId },
  });

  revalidatePath("/themes");
  revalidatePath("/profile");
  return ok(undefined);
};
