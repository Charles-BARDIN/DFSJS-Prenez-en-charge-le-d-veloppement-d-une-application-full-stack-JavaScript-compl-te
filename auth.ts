import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

/**
 * Configuration Auth.js (NextAuth v5).
 * - Provider Credentials : connexion par e-mail OU nom d'utilisateur + mot de passe.
 * - Stratégie JWT : la session est stockée dans un cookie signé (persistance
 *   entre les sessions sans table ni store serveur).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
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

        // Les données retournées alimentent le token JWT (callbacks ci-dessous).
        return { id: user.id, email: user.email, name: user.username };
      },
    }),
  ],
  callbacks: {
    // Au login, on persiste l'identifiant et le nom d'utilisateur dans le token.
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.username = user.name as string;
      }
      return token;
    },
    // On expose ces informations côté session (accessibles via auth()).
    session: ({ session, token }) => {
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    },
  },
});
