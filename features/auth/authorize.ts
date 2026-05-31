import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

/**
 * Vérifie les identifiants de connexion (provider Credentials d'Auth.js).
 * Accepte un e-mail OU un nom d'utilisateur, compare le mot de passe au hash
 * stocké, et retourne l'utilisateur authentifié ou `null` en cas d'échec.
 */
export const authorize = async (credentials: unknown) => {
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) return null;

  const { identifier, password } = parsed.data;

  // L'identifiant peut être l'e-mail ou le nom d'utilisateur.
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });
  if (!user) return null;

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return null;

  // Les données retournées alimentent le token JWT (callbacks d'auth.config).
  return { id: user.id, email: user.email, name: user.username };
};
