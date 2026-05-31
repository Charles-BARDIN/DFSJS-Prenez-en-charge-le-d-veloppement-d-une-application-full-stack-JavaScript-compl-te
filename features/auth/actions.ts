"use server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { registerSchema } from "@/lib/validations";
import { type ActionResult, ok, fail } from "@/lib/action-result";

/**
 * Inscrit un nouvel utilisateur : valide les données, hache le mot de passe,
 * crée le compte puis connecte automatiquement l'utilisateur.
 */
export const registerUser = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  const parsed = registerSchema.safeParse({
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
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });
  } catch (error) {
    // Violation d'unicité sur l'e-mail ou le nom d'utilisateur.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("Cet e-mail ou ce nom d'utilisateur est déjà utilisé.");
    }
    return fail("La création du compte a échoué.");
  }

  // Connexion automatique après inscription (sans redirection ici : la page
  // appelante gère la navigation une fois le résultat reçu).
  await signIn("credentials", {
    identifier: email,
    password,
    redirect: false,
  });

  return ok(undefined);
};
