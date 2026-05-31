"use server";

import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/auth";
import { loginSchema, registerSchema } from "@/lib/validations";
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

/**
 * Connecte un utilisateur à partir d'un e-mail OU d'un nom d'utilisateur et d'un
 * mot de passe.
 */
export const login = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return fail("Le formulaire contient des erreurs.", {
      identifier: fieldErrors.identifier?.[0] ?? "",
      password: fieldErrors.password?.[0] ?? "",
    });
  }

  try {
    await signIn("credentials", {
      identifier: parsed.data.identifier,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    // Identifiants incorrects (message générique, sans préciser le champ fautif).
    if (error instanceof AuthError) {
      return fail("Identifiant ou mot de passe incorrect.");
    }
    throw error;
  }

  return ok(undefined);
};

/** Déconnecte l'utilisateur courant et le renvoie vers la page d'accueil. */
export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
