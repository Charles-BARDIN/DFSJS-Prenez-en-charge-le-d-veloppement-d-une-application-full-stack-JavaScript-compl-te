"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/current-user";
import { createArticleSchema } from "@/lib/validations";
import { type ActionResult, fail } from "@/lib/action-result";

/**
 * Crée un article pour l'utilisateur courant.
 * L'auteur et la date sont définis automatiquement (non fournis par le client).
 * En cas de succès, redirige vers la page de l'article créé.
 */
export const createArticle = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return fail("Vous devez être connecté.");

  const parsed = createArticleSchema.safeParse({
    topicId: formData.get("topicId"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return fail("Le formulaire contient des erreurs.", {
      topicId: fieldErrors.topicId?.[0] ?? "",
      title: fieldErrors.title?.[0] ?? "",
      content: fieldErrors.content?.[0] ?? "",
    });
  }

  const article = await prisma.article.create({
    data: { ...parsed.data, authorId: user.id },
  });

  revalidatePath("/");
  redirect(`/articles/${article.id}`);
};
