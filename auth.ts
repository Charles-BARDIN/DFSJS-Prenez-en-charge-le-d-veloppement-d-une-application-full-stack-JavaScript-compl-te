import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { authConfig } from "@/auth.config";

/**
 * Instance complète Auth.js (NextAuth v5).
 * - Reprend la configuration edge-safe (authConfig) et y ajoute le provider
 *   Credentials, qui accède à la base de données (donc hors edge runtime).
 * - Connexion par e-mail OU nom d'utilisateur + mot de passe ; session JWT.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: {},
        password: {},
      },
      authorize: async (credentials) => {
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

        // Les données retournées alimentent le token JWT (callbacks ci-dessus).
        return { id: user.id, email: user.email, name: user.username };
      },
    }),
  ],
});
