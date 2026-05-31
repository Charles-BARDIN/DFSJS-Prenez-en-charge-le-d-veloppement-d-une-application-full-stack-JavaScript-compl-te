"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/current-user";
import { updateProfileSchema } from "@/lib/validations";
import { type ActionResult, ok, fail } from "@/lib/action-result";

/**
 * Met à jour le profil de l'utilisateur courant (e-mail, nom d'utilisateur et,
 * optionnellement, mot de passe). Le mot de passe n'est modifié que s'il est
 * renseigné, et il est haché avant stockage.
 */
export const updateProfile = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return fail("Vous devez être connecté.");

  const parsed = updateProfileSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return fail("Le formulaire contient des erreurs.", {
      email: fieldErrors.email?.[0] ?? "",
      username: fieldErrors.username?.[0] ?? "",
      password: fieldErrors.password?.[0] ?? "",
    });
  }

  const { email, username, password } = parsed.data;

  const data: Prisma.UserUpdateInput = { email, username };
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  try {
    await prisma.user.update({ where: { id: user.id }, data });
  } catch (error) {
    // Violation d'unicité sur l'e-mail ou le nom d'utilisateur.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("Cet e-mail ou ce nom d'utilisateur est déjà utilisé.");
    }
    return fail("La mise à jour du profil a échoué.");
  }

  revalidatePath("/profile");
  return ok(undefined);
};
