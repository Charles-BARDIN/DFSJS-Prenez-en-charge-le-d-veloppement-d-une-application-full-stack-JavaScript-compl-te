"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/current-user";
import { createCommentSchema } from "@/lib/validations";
import { type ActionResult, ok, fail } from "@/lib/action-result";

/**
 * Ajoute un commentaire à un article pour l'utilisateur courant.
 * L'auteur et la date sont définis automatiquement (non fournis par le client).
 */
export const addComment = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return fail("Vous devez être connecté.");

  const parsed = createCommentSchema.safeParse({
    articleId: formData.get("articleId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return fail("Le formulaire contient des erreurs.", {
      content: fieldErrors.content?.[0] ?? "",
    });
  }

  // Vérifie que l'article existe avant d'y rattacher un commentaire.
  const article = await prisma.article.findUnique({
    where: { id: parsed.data.articleId },
    select: { id: true },
  });
  if (!article) return fail("Cet article n'existe pas.");

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      articleId: parsed.data.articleId,
      authorId: user.id,
    },
  });

  revalidatePath(`/articles/${parsed.data.articleId}`);
  return ok(undefined);
};
